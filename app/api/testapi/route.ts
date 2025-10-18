import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://meet-hermit-35370.upstash.io",
  token: "AYoqAAIncDEwYWVjMDFmNDIxMjM0N2Y4OTRkMzkwODBhNDdjNzRhYnAxMzUzNzA",
});

(async () => {
  await redis.flushdb();
  console.log("✅ Redis database cleared successfully!");
})();
