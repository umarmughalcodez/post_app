import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  const user = session?.user;

  try {
    const postCount = await prisma.posts.count({
      where: {
        userEmail: user?.email as string,
      },
    });

    return NextResponse.json({ status: 200, limit: postCount });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
