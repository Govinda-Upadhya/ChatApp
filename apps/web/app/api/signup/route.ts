import { prismaClient } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";
export async function POST(req: NextRequest) {
  const userInfo = await req.json();
  try {
    let emailExists = await prismaClient.user.findFirst({
      where: {
        email: userInfo.email,
      },
    });
    if (emailExists) {
      return NextResponse.json(
        {
          message: "email already exist please use a different email",
        },
        {
          status: 401,
        }
      );
    }
    let usernameExists = await prismaClient.user.findFirst({
      where: {
        username: userInfo.username,
      },
    });
    if (usernameExists) {
      return NextResponse.json(
        {
          message: "User already exists please login or use different username",
        },
        {
          status: 401,
        }
      );
    }
    let hashedPassword = await bcrypt.hash(userInfo.password, 5);
    let createdUser = await prismaClient.user.create({
      data: {
        username: userInfo.username,
        password: hashedPassword,
        email: userInfo.email,
      },
    });
    return NextResponse.json({ message: "User created!" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "user not created server error" },
      { status: 500 }
    );
  }
}
