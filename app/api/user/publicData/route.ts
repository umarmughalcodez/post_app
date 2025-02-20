import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  return NextResponse.json({ status: 200, user });
};
