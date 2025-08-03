import { prismaClient } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");
  const messageSend = await prismaClient.chat.findMany({
    where: {
      sender: user2,
      receiver: user1,
    },
  });
  const messageReceived = await prismaClient.chat.findMany({
    where: {
      sender: user1,
      receiver: user2,
    },
  });
  let messages = [...messageReceived, ...messageSend];
  messages.sort((a, b) => {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  });
  messages = messages.map((msg) => ({
    ...msg,
    time: new Date(msg.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return NextResponse.json({ message: messages }, { status: 200 });
}
