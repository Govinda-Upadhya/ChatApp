import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import { prismaClient } from "@repo/db/client";

export async function POST(req: NextRequest) {
  let data = await req.json();
  const session = await getServerSession(authOptions);
  const user = session?.user?.name;

  if (data.type == "accept") {
    // let friendshipexists1 = await prismaClient.friendship.findFirst({
    //   where: {
    //     user1: user,
    //     user2: data.person,
    //   },
    // });
    let friendshipexists2 = await prismaClient.friendship.findFirst({
      where: {
        user1: data.person,
        user2: user,
      },
    });
    if (!friendshipexists2) {
      let makefriendShip = await prismaClient.friendship.create({
        data: {
          user1: user,
          user2: data.person,
        },
      });
      const request = await prismaClient.friendRequest.findFirst({
        where: {
          sender: data.person,
          receiver: user,
        },
      });

      if (request) {
        await prismaClient.friendRequest.update({
          where: { id: request.id },
          data: { status: "ACCEPTED" },
        });
      }
      return NextResponse.json(
        { message: "request accepted" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "friendship already exisrts" },
        { status: 400 }
      );
    }
  } else {
    await prismaClient.friendRequest.update({
      where: {
        sender: data.person,
        receiver: user,
      },
      data: {
        status: "REJECTED",
      },
    });
    return NextResponse.json({ message: "request declined" }, { status: 400 });
  }

  return NextResponse.json(
    { message: "coudlnt make friends" },
    { status: 400 }
  );
}
