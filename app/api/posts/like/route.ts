import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    const user = session?.user;
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");

    if (!user) {
      return NextResponse.json({
        error: "User not authenticated",
        status: 401,
      });
    }

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required", status: 400 });
    }

    const existingLike = await prisma.likes.findUnique({
      where: {
        userEmail_postId: {
          userEmail: user.email as string,
          postId: postId as string,
        },
      },
    });

    if (existingLike) {
      await prisma.likes.delete({
        where: {
          userEmail_postId: {
            userEmail: user.email as string,
            postId: postId as string,
          },
        },
      });

      return NextResponse.json({
        status: 200,
        message: "Post un-liked successfully",
      });
    }

    await prisma.likes.create({
      data: {
        postId: postId as string,
        userEmail: user.email as string,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "Post liked successfully",
    });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};
