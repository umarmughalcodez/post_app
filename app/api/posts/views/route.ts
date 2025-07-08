import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { postId, userEmail } = body;

  if (!postId || !userEmail) {
    return NextResponse.json(
      { message: "Missing postId or userEmail" },
      { status: 400 }
    );
  }
  try {
    const existingView = await prisma.post_views.findUnique({
      where: {
        userEmail_postId: {
          userEmail,
          postId,
        },
      },
    });

    if (!existingView) {
      await prisma.post_views.create({
        data: {
          postId,
          userEmail,
        },
      });
    }

    return NextResponse.json({ message: "View recorded successfully!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to record view" },
      { status: 500 }
    );
  }
};
