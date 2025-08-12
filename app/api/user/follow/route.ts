import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    const authUser = session?.user;
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!authUser) {
      return NextResponse.json(
        { error: "authUser not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
    });

    const existingFollower = await prisma.followers.findFirst({
      where: {
        userEmail: authUser.email as string,
        authorEmail: email as string,
      },
    });

    if (existingFollower) {
      await prisma.followers.deleteMany({
        where: {
          userEmail: authUser.email as string,
          authorEmail: email as string,
        },
      });
      return NextResponse.json(
        { message: "Unfollowed successfully", user },
        { status: 200 }
      );
    }

    if (existingFollower) {
      return NextResponse.json(
        { message: "Already following", user },
        { status: 200 }
      );
    }

    await prisma.followers.create({
      data: {
        userEmail: authUser.email as string,
        authorEmail: email as string,
      },
    });

    return NextResponse.json(
      { message: "Followed successfully", user },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
};
