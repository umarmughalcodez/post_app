import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    const user = session?.user;

    const followers = await prisma.followers.findMany({
      where: {
        userEmail: user?.email as string,
      },
      select: {
        authorEmail: true,
      },
    });

    const followedUsers = followers.map((follower) => follower.authorEmail);

    return NextResponse.json({
      status: 200,
      message: "Followed Users fetched successfully",
      followedUsers,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 400, error: error.message });
    }
  }
};
