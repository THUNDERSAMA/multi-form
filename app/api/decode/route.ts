// import { NextRequest, NextResponse } from "next/server";
// import { Redis } from "@upstash/redis";

// // Connect to Upstash
// const redis = new Redis({
//   url: "https://meet-hermit-35370.upstash.io",
//   token: "AYoqAAIncDEwYWVjMDFmNDIxMjM0N2Y4OTRkMzkwODBhNDdjNzRhYnAxMzUzNzA",
// });

// export async function POST(req: NextRequest) {
//   const { input } = await req.json();

//   const yearShort = new Date().getFullYear().toString().substring(2);
//   const yearIndex = input.indexOf(yearShort);
//   if (yearIndex === -1) {
//     return NextResponse.json(
//       { error: "Invalid input format" },
//       { status: 400 }
//     );
//   }

//   const encodedId = input.substring(0, yearIndex);
//   const encodedAfterYear = input.substring(yearIndex + yearShort.length);

//   const id = fromBase62(encodedId);
//   const beforeYear = await redis.get(`id:${id}`);
//   if (!beforeYear) {
//     return NextResponse.json({ error: "ID not found" }, { status: 404 });
//   }

//   let afterYear = fromBase62(encodedAfterYear).toString();
//   if (afterYear.length < 12) afterYear = "0" + afterYear;
//   let decodedString = beforeYear + "20" + yearShort + afterYear;
//   if (decodedString.length < 12) decodedString = "0" + decodedString;

//   return NextResponse.json({ decoded: decodedString });
// }

// function fromBase62(str: string) {
//   const chars =
//     "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   let result = 0;
//   for (let i = 0; i < str.length; i++) {
//     result = result * 62 + chars.indexOf(str[i]);
//   }
//   return result;
// }

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Connect to Upstash
const redis = new Redis({
  url: "https://meet-hermit-35370.upstash.io",
  token: "AYoqAAIncDEwYWVjMDFmNDIxMjM0N2Y4OTRkMzkwODBhNDdjNzRhYnAxMzUzNzA",
});

export async function POST(req: NextRequest) {
  const { input } = await req.json(); // e.g. "A0000000001"

  if (!input || input.length !== 11) {
    return NextResponse.json(
      { error: "Invalid tracking number format" },
      { status: 400 }
    );
  }

  // Direct lookup — instant O(1)
  const original = await redis.get<string>(`decode:${input}`);

  if (!original) {
    return NextResponse.json(
      { error: "Tracking number not found" },
      { status: 404 }
    );
  }

  const decoded = {
    trackingNo: input,
    original,
    prefix: input.charAt(0),
    number: input.substring(1),
  };

  return NextResponse.json({ decoded: original });
}
