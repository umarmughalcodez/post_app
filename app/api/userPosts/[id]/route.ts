interface Context {
  params: Promise<{
    id: string;
  }>;
}

import prisma from "@/prisma/db.config";
import { auth } from "@/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: Context) {
  const session = await auth();
  const user = session?.user;
  try {
    const id = await context.params;
    const post = await prisma.posts.findUnique({
      where: {
        id: String(id),
        userEmail: user?.email as string,
      },
      include: {
        _count: {
          select: {
            views: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({
        message: "You are not this post's author or invalid post Id",
        status: 400,
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "An error occurred while fetching the post",
    });
  }
}
