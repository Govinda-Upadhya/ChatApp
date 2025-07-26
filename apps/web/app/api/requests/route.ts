import { prismaClient } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const currentUser = session?.user?.name;

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await prismaClient.friendRequest.findMany({
      where: {
        receiver: currentUser,
        status: "PENDING",
      },
      include: {
        requestSender: {
          select: {
            username: true,
            profile: true,
          },
        },
      },
    });
    console.log(res);

    const requests = res.map((req) => ({
      sender: req.requestSender.username,
      profile: req.requestSender.profile,
      status: req.status,
      sentAt: req.time,
    }));

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
