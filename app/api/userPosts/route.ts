import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ message: "User not found", status: 404 });
    }

    const posts = await prisma.posts.findMany({
      where: {
        userEmail: user?.email as string,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Posts fetched successfully!",
      posts,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch posts", status: 400 });
  }
};
