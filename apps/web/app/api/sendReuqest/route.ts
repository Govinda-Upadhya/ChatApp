import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import { prismaClient } from "@repo/db/client";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user?.name;

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const receiver = data.username;

    if (!receiver) {
      return NextResponse.json(
        { message: "Receiver username missing" },
        { status: 400 }
      );
    }

    const existingRequest = await prismaClient.friendRequest.findFirst({
      where: {
        sender: user,
        receiver: receiver,
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "Friend request already sent" },
        { status: 400 }
      );
    }

    const receiverExists = await prismaClient.user.findUnique({
      where: {
        username: receiver,
      },
    });

    if (!receiverExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const createRequest = await prismaClient.friendRequest.create({
      data: {
        sender: user,
        receiver: receiver,
      },
    });

    return NextResponse.json(
      { message: "Request sent", request: createRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /send-friend-request error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
