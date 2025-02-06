import prisma from "@/prisma/db.config";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (context: Context) => {
  const session = await auth();
  const user = session?.user;
  try {
    const { id } = await context.params;
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
