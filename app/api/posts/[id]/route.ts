import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

const createResponse = (status: number, message: string, data?: unknown) => {
  return NextResponse.json({ status, message, data });
};

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (req: NextRequest, context: Context) => {
  const session = await auth();
  const user = session?.user;

  try {
    const { id } = await context.params;
    const post = await prisma.posts.findUnique({
      where: {
        id,
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
      return createResponse(404, "Post not found");
    }

    return createResponse(200, "Post fetched successfully", post);
  } catch (error) {
    console.error(error);
    return createResponse(400, "Failed to fetch post");
  }
};

export const PUT = async (req: NextRequest, context: Context) => {
  const { id } = await context.params;

  const body = await req.json();
  const { title, description, image_url } = body;

  if (!title && !description) {
    return createResponse(404, "please fill out all the fields");
  }

  const post = await prisma.posts.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    return createResponse(404, "Post not found");
  }

  try {
    const updatedPost = await prisma.posts.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        image_url,
      },
    });

    return createResponse(200, "Post updated successfully", updatedPost);
  } catch (error) {
    console.error(error);
    return createResponse(400, "Failed to update post");
  }
};

export const DELETE = async (req: Request, context: Context) => {
  const { id } = await context.params;

  try {
    const post = await prisma.posts.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!post) {
      return createResponse(404, "Post not found");
    }

    await prisma.post_views.deleteMany({
      where: {
        id: id as string,
      },
    });

    await prisma.posts.deleteMany({
      where: {
        id: id as string,
      },
    });

    return createResponse(200, "Post deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
