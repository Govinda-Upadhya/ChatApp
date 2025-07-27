import { prismaClient } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const myUsername = session?.user?.name;

  const friendships = await prismaClient.friendship.findMany({
    where: {
      OR: [{ user1: myUsername }, { user2: myUsername }],
    },
    include: {
      userA: {
        select: {
          profile: true,
        },
      },
      userB: {
        select: {
          profile: true,
        },
      },
      room: {
        select: {
          id: true,
        },
      },
    },
  });

  const friends = friendships.map((f) => {
    const isUser1 = f.user1 === myUsername;
    return {
      username: isUser1 ? f.user2 : f.user1,
      profile: isUser1 ? f.userB.profile : f.userA.profile,
      roomId: f.roomId,
    };
  });
  console.log("friends", friends);
  return NextResponse.json({ friends }, { status: 200 });
}
