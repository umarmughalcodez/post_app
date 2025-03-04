import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    const user = session?.user;
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId") as string;

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
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.likes.delete({
        where: {
          userEmail_postId: {
            userEmail: user.email as string,
            postId,
          },
        },
      });
      return NextResponse.json({
        status: 200,
        messagee: "Post un-liked successfully",
      });
    }

    await prisma.likes.create({
      data: {
        postId,
        userEmail: user.email as string,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "Post liked successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, status: 400 });
    }
  }
};
