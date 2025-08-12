import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();
    const user = session?.user;

    await prisma.user.update({
      where: {
        email: user?.email as string,
      },
      data: {
        premiumAccountHolder: false,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Subscription successfully cancelled",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 400, error: error.message });
    }
  }
};
