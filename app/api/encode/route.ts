import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Connect to Upstash
const redis = new Redis({
  url: "https://meet-hermit-35370.upstash.io",
  token: "AYoqAAIncDEwYWVjMDFmNDIxMjM0N2Y4OTRkMzkwODBhNDdjNzRhYnAxMzUzNzA",
});

// Lock timeout (ms) - if a lock isn't released in 5 seconds, consider it expired
const LOCK_TIMEOUT = 5000;
const MAX_RETRIES = 3;

/**
 * Generate short code from counter
 */
function generateShortCode(counter: number): string {
  // Calculate cycle (each cycle = 10 billion numbers)
  const cycle = Math.floor((counter - 1) / 10_000_000_000);

  // Determine prefix letter (A-Z looping)
  const prefixLetter = String.fromCharCode(65 + (cycle % 26));

  // 10-digit numeric part within current cycle
  const numericPart = String((counter - 1) % 10_000_000_000).padStart(10, "0");

  return prefixLetter + numericPart;
}

/**
 * Acquire distributed lock
 */
async function acquireLock(
  lockKey: string,
  lockValue: string
): Promise<boolean> {
  try {
    // Use SET with NX (only set if not exists) and PX (expire in milliseconds)
    const result = await redis.set(lockKey, lockValue, {
      nx: true, // Only set if key doesn't exist
      px: LOCK_TIMEOUT, // Expire after LOCK_TIMEOUT ms
    });

    return result === "OK";
  } catch (error) {
    console.error("Lock acquisition error:", error);
    return false;
  }
}

/**
 * Release distributed lock
 */
async function releaseLock(lockKey: string, lockValue: string): Promise<void> {
  try {
    // Only delete if the lock value matches (prevents deleting someone else's lock)
    const currentValue = await redis.get(lockKey);
    if (currentValue === lockValue) {
      await redis.del(lockKey);
    }
  } catch (error) {
    console.error("Lock release error:", error);
  }
}

/**
 * Encode with distributed lock and retries
 */
export async function POST(req: NextRequest) {
  const { input } = await req.json();

  // Validate input
  if (!input || typeof input !== "string") {
    return NextResponse.json(
      { error: "Invalid input: tracking number is required" },
      { status: 400 }
    );
  }

  // Sanitize input
  const sanitizedInput = input.trim();
  if (!sanitizedInput) {
    return NextResponse.json(
      { error: "Invalid input: tracking number cannot be empty" },
      { status: 400 }
    );
  }

  // Check if already encoded (fast path - no lock needed)
  let existingCode = await redis.get<string>(`track:${sanitizedInput}`);
  if (existingCode) {
    return NextResponse.json({
      encoded: existingCode,
      original: sanitizedInput,
      isNew: false,
    });
  }

  // Need to create new code - acquire lock
  const lockKey = `lock:encode:${sanitizedInput}`;
  const lockValue = `${Date.now()}-${Math.random()}`; // Unique lock value

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Try to acquire lock
      const lockAcquired = await acquireLock(lockKey, lockValue);

      if (!lockAcquired) {
        // Someone else is encoding this, wait and retry
        await new Promise((resolve) =>
          setTimeout(resolve, 100 * (attempt + 1))
        );

        // Check again if it was encoded while we waited
        existingCode = await redis.get<string>(`track:${sanitizedInput}`);
        if (existingCode) {
          return NextResponse.json({
            encoded: existingCode,
            original: sanitizedInput,
            isNew: false,
          });
        }

        continue; // Retry
      }

      // We have the lock - double check it wasn't created
      existingCode = await redis.get<string>(`track:${sanitizedInput}`);
      if (existingCode) {
        await releaseLock(lockKey, lockValue);
        return NextResponse.json({
          encoded: existingCode,
          original: sanitizedInput,
          isNew: false,
        });
      }

      // Generate new unique code
      const counter = await redis.incr("global:unique11");
      const uniqueCode = generateShortCode(counter);

      // Verify uniqueness (paranoid check)
      const existingMapping = await redis.get<string>(`decode:${uniqueCode}`);
      if (existingMapping && existingMapping !== sanitizedInput) {
        // Collision detected! This should never happen, but if it does, increment again
        console.error(
          `COLLISION DETECTED: ${uniqueCode} already maps to ${existingMapping}`
        );
        const newCounter = await redis.incr("global:unique11");
        const newUniqueCode = generateShortCode(newCounter);

        // Save with new code
        await Promise.all([
          redis.set(`track:${sanitizedInput}`, newUniqueCode),
          redis.set(`decode:${newUniqueCode}`, sanitizedInput),
        ]);

        await releaseLock(lockKey, lockValue);

        return NextResponse.json({
          encoded: newUniqueCode,
          original: sanitizedInput,
          isNew: true,
          warning: "Collision resolved with new code",
        });
      }

      // Save both mappings
      await Promise.all([
        redis.set(`track:${sanitizedInput}`, uniqueCode),
        redis.set(`decode:${uniqueCode}`, sanitizedInput),
      ]);

      // Release lock
      await releaseLock(lockKey, lockValue);

      return NextResponse.json({
        encoded: uniqueCode,
        original: sanitizedInput,
        isNew: true,
      });
    } catch (error: any) {
      // Release lock on error
      await releaseLock(lockKey, lockValue);

      console.error(`Encode error (attempt ${attempt + 1}):`, error);

      if (attempt === MAX_RETRIES - 1) {
        return NextResponse.json(
          { error: "Failed to encode after multiple attempts" },
          { status: 500 }
        );
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }

  return NextResponse.json(
    { error: "Failed to acquire lock after maximum retries" },
    { status: 503 }
  );
}
