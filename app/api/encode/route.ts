// import { NextRequest, NextResponse } from "next/server";
// import { Redis } from "@upstash/redis";

// // Connect to Upstash
// const redis = new Redis({
//   url: "https://meet-hermit-35370.upstash.io",
//   token: "AYoqAAIncDEwYWVjMDFmNDIxMjM0N2Y4OTRkMzkwODBhNDdjNzRhYnAxMzUzNzA",
// });

// export async function POST(req: NextRequest) {
//   const { input } = await req.json();

//   const currentYear = new Date().getFullYear().toString();
//   const yearIndex = input.indexOf(currentYear);
//   if (yearIndex === -1) {
//     return NextResponse.json(
//       { error: "Invalid input format" },
//       { status: 400 }
//     );
//   }

//   const beforeYear = input.substring(0, yearIndex);
//   const afterYear = input.substring(yearIndex + currentYear.length);

//   let id: number | null = await redis.get(`part:${beforeYear}`);
//   if (!id) {
//     const counter = await redis.incr("counter:parts");
//     await redis.set(`part:${beforeYear}`, counter);
//     await redis.set(`id:${counter}`, beforeYear);
//     id = counter;
//   }

//   const encodedId = toBase62(id);
//   const yearShort = currentYear.substring(2);
//   const encodedAfterYear = toBase62(Number(afterYear));

//   const finalString = encodedId + yearShort + encodedAfterYear;
//   return NextResponse.json({ encoded: finalString });
// }

// function toBase62(num: any) {
//   const chars =
//     "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   let result = "";
//   while (num > 0) {
//     result = chars[num % 62] + result;
//     num = Math.floor(num / 62);
//   }
//   return result || "0";
// }
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Connect to Upstash
const redis = new Redis({
  url: "https://meet-hermit-35370.upstash.io",
  token: "AYoqAAIncDEwYWVjMDFmNDIxMjM0N2Y4OTRkMzkwODBhNDdjNzRhYnAxMzUzNzA",
});

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  // Check if already encoded
  let uniqueCode = await redis.get<string>(`track:${input}`);

  if (!uniqueCode) {
    // Increment global counter
    const counter = await redis.incr("global:unique11");

    // Determine prefix letter (A-Z looping)
    const cycle = Math.floor((counter - 1) / 10);
    const prefixLetter = String.fromCharCode(65 + (cycle % 26)); // A-Z looping

    // 10-digit numeric part
    const numericPart = String(counter % 10_000_000_000).padStart(10, "0");

    // Combine to final 11-char tracking code
    uniqueCode = prefixLetter + numericPart;

    // Save both mappings
    await redis.set(`track:${input}`, uniqueCode);
    await redis.set(`decode:${uniqueCode}`, input);
  }

  return NextResponse.json({ encoded: uniqueCode });
}
