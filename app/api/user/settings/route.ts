import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();
    const user = session?.user;

    // const cachedUser = await redis.get(`user:${user?.email}`);

    // if (cachedUser) {
    //   return NextResponse.json(
    //     { message: "User exists", user: JSON.parse(cachedUser) },
    //     { status: 200 }
    //   );
    // }

    if (!user) {
      console.log("User not found through auth");
      return;
    }

    const fetchedUser = await prisma.user.findUnique({
      where: {
        email: user.email as string,
      },
    });

    return NextResponse.json({ status: 200, fetchedUser });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error });
    }
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, bio, username, image } = body;

    const session = await auth();
    const user = session?.user;

    // const usernameCheck = await prisma.user.findUnique({
    //   where: {
    //     username: username,
    //   },
    // });

    // if (usernameCheck) {
    //   return NextResponse.json({ status: 409 });
    // }

    const updatedUser = await prisma.user.update({
      where: {
        email: user?.email as string,
      },
      data: {
        name,
        bio,
        username,
        image,
      },
    });

    return NextResponse.json({ status: 200, updatedUser });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch user details");
    }
  }
};
