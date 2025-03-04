import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    const user = session?.user;
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const existingFollower = await prisma.followers.findFirst({
      where: {
        userEmail: user.email as string,
        authorEmail: email as string,
      },
    });

    if (existingFollower) {
      await prisma.followers.deleteMany({
        where: {
          userEmail: user.email as string,
          authorEmail: email as string,
        },
      });
      return NextResponse.json(
        { message: "Unfollowed successfully" },
        { status: 200 }
      );
    }

    if (existingFollower) {
      return NextResponse.json(
        { message: "Already following" },
        { status: 200 }
      );
    }

    await prisma.followers.create({
      data: {
        userEmail: user.email as string,
        authorEmail: email as string,
      },
    });

    return NextResponse.json(
      { message: "Followed successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
};
