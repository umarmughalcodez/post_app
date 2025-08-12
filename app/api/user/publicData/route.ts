import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    const user = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
      include: {
        _count: {
          select: {
            views: true,
            followers: true,
            likes: true,
          },
        },
      },
    });

    return NextResponse.json({ status: 200, user });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    }
  }
};
