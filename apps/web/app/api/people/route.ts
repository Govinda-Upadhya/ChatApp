import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import { prismaClient } from "@repo/db/client";
import { profile } from "console";
import { Poetsen_One } from "next/font/google";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const me = await prismaClient.user.findFirst({
    where: { username: session?.user?.name },
    select: {
      requestSent: {
        select: {
          receiver: true,
          status: true,
        },
      },
      requestReceived: {
        select: {
          sender: true,
          status: true,
        },
      },
    },
  });
  const requestSend = me.requestSent;
  console.log("requestsend", requestSend);
  const requestReceived = me.requestReceived;

  const people = await prismaClient.user.findMany({
    where: {
      username: { not: session?.user.name },
    },
    select: {
      username: true,
      profile: true,
      requestSent: {
        select: {
          receiver: true,
          status: true,
        },
      },
      requestReceived: {
        select: {
          sender: true,
          status: true,
        },
      },
    },
  });
  console.log("people", people[0].requestSent[0]);
  let newinfo: { username: string; profile: string; status: string }[] = [];
  for (const person of people) {
    const data = {
      username: person.username,
      profile: person.profile,
      status: "notsend",
    };
    newinfo.push(data);
  }

  for (let i = 0; i < newinfo.length; i++) {
    for (let j = 0; j < requestSend.length; j++) {
      if (newinfo[i]?.username == requestSend[j].receiver) {
        console.log("requestSend[j].receiver", requestSend[j].receiver);
        console.log("status", requestSend[j]);
        newinfo[i].status = requestSend[j].status;
      }
    }
  }
  const spliceIndex: number[] = [];
  for (let i = 0; i < newinfo.length; i++) {
    for (let j = 0; j < requestReceived.length; j++) {
      if (newinfo[i]?.username == requestReceived[j].sender) {
        spliceIndex.push(i);
      }
    }
  }
  for (const index of spliceIndex.sort((a, b) => b - a)) {
    newinfo.splice(index, 1);
  }

  return NextResponse.json({ people: newinfo }, { status: 200 });
}
