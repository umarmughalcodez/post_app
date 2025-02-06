import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const createResponse = (status: number, message: string, data?: unknown) => {
  return NextResponse.json({ status, message, data });
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "3", 10), 1),
      6
    );

    const skip = (page - 1) * limit;

    const posts = await prisma.posts.findMany({
      skip,
      take: limit,
    });

    const totalPosts = await prisma.posts.count();

    return createResponse(200, "Posts fetched successfully", {
      posts,
      totalPosts,
    });
  } catch (error) {
    return createResponse(400, "Failed to fetch posts");
  }
};

export const POST = async (req: NextRequest) => {
  const session = await auth();
  const user = session?.user;
  const body = await req.json();
  const { title, description, publicId } = body;

  if (!title && !description && !publicId) {
    return createResponse(404, "please fill out all the fields");
  }

  const url = `https://res.cloudinary.com/xcorpion/image/upload/${publicId}`;

  try {
    const post = await prisma.posts.create({
      data: {
        title,
        description,
        image_url: url,
        userEmail: user?.email as string,
      },
    });

    return createResponse(201, "Post created successfully", post);
  } catch (error) {
    return createResponse(400, "Failed to fetch posts");
  }
};
