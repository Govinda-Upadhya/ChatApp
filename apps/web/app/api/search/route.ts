import { prismaClient } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { getServerField } from "next/dist/server/lib/render-server";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = await getServerSession(authOptions);
  const user = session?.user.name;
  const item = searchParams.get("item");
  const type = searchParams.get("type");

  switch (type) {
    case "search":
      const people = await prismaClient.user.findMany({
        where: {
          username: { contains: item, mode: "insensitive", not: user },
        },
        select: {
          username: true,
          profile: true,
          requestSent: {
            select: {
              receiver: true,
            },
          },
          requestReceived: {
            select: {
              sender: true,
            },
          },
        },
      });
      const me = await prismaClient.user.findFirst({
        where: { username: session?.user?.name },
        select: {
          requestSent: {
            select: {
              receiver: true,
            },
          },
          requestReceived: {
            select: {
              sender: true,
            },
          },
        },
      });
      const requestSend = me.requestSent;
      const requestReceived = me.requestReceived;
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
            newinfo[i].status = "PENDING";
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

      return NextResponse.json(
        { people: newinfo, type: type },
        { status: 200 }
      );
      break;

    default:
      break;
  }

  return NextResponse.json({ item });
}
