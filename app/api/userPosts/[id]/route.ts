import prisma from "@/prisma/db.config";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (request: NextRequest) => {
  const session = await auth();
  const user = session?.user;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        message: "Invalid post Id",
        status: 400,
      });
    }

    const post = prisma.posts.findUnique({
      where: {
        id: String(id),
        userEmail: user?.email as string,
      },
    });

    if (!post) {
      return NextResponse.json({
        message: "You are not thsi post's author or invalid post Id",
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
  }
};
