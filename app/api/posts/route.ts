import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

const createResponse = (status: number, message: string, data?: unknown) => {
  return NextResponse.json({ status, message, data });
};

export const GET = async (req: NextRequest) => {
  try {
    const posts = await prisma.posts.findMany({});

    return createResponse(200, "Posts fetched successfully", posts);
  } catch (error) {
    console.error(error);
    return createResponse(400, "Failed to fetch posts");
  }
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { title, description } = body;

  if (!title && !description) {
    return createResponse(404, "please fill out all the fields");
  }

  try {
    const post = await prisma.posts.create({
      data: {
        title,
        description,
      },
    });

    return createResponse(201, "Post created successfully", post);
  } catch (error) {
    console.error(error);
    return createResponse(400, "Failed to fetch posts");
  }
};
