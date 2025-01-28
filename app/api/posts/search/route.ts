import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { keyword } = body;
    // const keyword = body.keyword;
    console.log(keyword);

    const matchedPosts = await prisma.posts.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (!matchedPosts || matchedPosts.length === 0) {
      return NextResponse.json({ status: 404, message: "Post not found" });
    }

    return NextResponse.json({
      status: 200,
      message: "Posts searched successfully",
      matchedPosts,
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: "Failed to search post",
      error,
    });
  }
};
