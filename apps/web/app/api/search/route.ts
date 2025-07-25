import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  return NextResponse.json({ message: "done" }, { status: 200 });
}
