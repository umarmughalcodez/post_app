import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

const createResponse = (status: number, message: string, data?: unknown) => {
  return NextResponse.json({ status, message, data });
};

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = await context.params;

    const post = await prisma.posts.findUnique({
      where: {
        id,
        // userEmail: user?.email as string,
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

export const PUT = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
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

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const { id } = await context.params;

  const post = await prisma.posts.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    return createResponse(404, "Post not found");
  }

  await prisma.posts.delete({
    where: {
      id,
    },
  });

  return createResponse(200, "Post deleted successfully");
};
