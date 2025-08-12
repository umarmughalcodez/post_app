import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    const user = session?.user;

    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (email) {
      const posts = await prisma.posts.findMany({
        where: {
          userEmail: email as string,
        },
        include: {
          _count: {
            select: {
              views: true,
              likes: true,
              comments: true,
            },
          },
        },
      });
      return NextResponse.json({ status: 200, posts });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found", status: 404 });
    }

    const posts = await prisma.posts.findMany({
      where: {
        userEmail: user?.email as string,
      },
      orderBy: {
        created_at: "desc",
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

    return NextResponse.json({
      status: 200,
      message: "Posts fetched successfully!",
      posts,
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: "Failed to fetch posts",
      error,
    });
  }
};
