import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found" });
    }

    const likes = await prisma.likes.findMany({
      where: {
        userEmail: user.email as string,
      },
      select: {
        postId: true,
      },
    });

    const likedPosts = likes.map((like) => like.postId);

    return NextResponse.json({
      status: 200,
      message: "Liked posts fetched successfully",
      likedPosts,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 400, error: error.message });
    }
  }
};
