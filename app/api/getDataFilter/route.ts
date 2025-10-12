import { NextResponse } from "next/server";

export async function POST(req: Request) {
  //console.log("FORM DATA JSON:", formDataJson);
  const { company, filter, startDate, endDate } = await req.json();
  const resp = await fetch("https://courierwallah.in/api/getDataFilter.php", {
    method: "POST",
    body: JSON.stringify({
      company: company,
      filter: filter,
      startDate: startDate,
      endDate: endDate,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(
    "STATUS:",
    resp.status,
    "\nCONTENT TYPE:",
    resp.headers.get("content-type")
  );
  const rawText = await resp.text();
  // console.log("raw response:",rawText);
  const data = JSON.parse(rawText);
  return NextResponse.json({ data });
}
