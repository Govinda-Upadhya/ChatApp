// app/api/token/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

const SECRET = "secret";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET });
  let newObj = {
    name: token?.name,
    email: token?.email,
  };
  const newToken = jwt.sign(newObj, SECRET);

  return NextResponse.json({ token: newToken });
}
