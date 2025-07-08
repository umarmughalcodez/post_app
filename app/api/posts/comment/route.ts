import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db.config";
import { getSession } from "next-auth/react";
import { auth } from "@/auth";

export const POST = async (req: NextRequest) => {
  const session = await auth();
  const user = session?.user;
  try {
    const body = await req.json();
    const { text, postId } = body;

    if (!postId || !text) {
      return NextResponse.json({
        status: 400,
        message: "Text & postId are required",
      });
    }

    console.log("Post Id", postId);

    await prisma.comments.upsert({
      where: {
        userEmail_postId: { postId, userEmail: user?.email as string },
      },
      update: {
        text,
      },
      create: {
        text,
        postId,
        userEmail: user?.email as string,
      },
    });

    return NextResponse.json({ status: 200, comment: text });
  } catch (error) {
    return NextResponse.json({ status: 400, message: "Failed to comment" });
  }
};

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  try {
    const comments = await prisma.comments.findMany({
      where: {
        postId: postId as string,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json({
      status: 200,
      comments,
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: "Failed to fetch comments",
    });
  }
};

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  const user = session?.user;
  try {
    const body = await req.json();
    const { text, postId } = body;

    await prisma.comments.updateMany({
      where: {
        postId: postId as string,
        userEmail: user?.email as string,
      },
      data: {
        text: text as string,
      },
    });

    return NextResponse.json({ status: 201, message: "Updated Successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 400, error: error.message });
    }
  }
};
