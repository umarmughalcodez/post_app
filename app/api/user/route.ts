import { auth } from "@/auth";
import prisma from "@/prisma/db.config";
import { NextResponse } from "next/server";

const randomImages = [
  "https://res.cloudinary.com/xcorpion/image/upload/v1739397695/g2bmldwl5dhruioh1m6k.png",
  "https://res.cloudinary.com/xcorpion/image/upload/v1739397471/hvyvkhibnlypviuqdpd8.png",
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * randomImages.length);
  return randomImages[randomIndex];
};

export const GET = async () => {
  try {
    const session = await auth();
    const fetchedUser = session?.user;

    if (!fetchedUser) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    let existingUser = await prisma.user.findUnique({
      where: {
        email: fetchedUser.email as string,
      },
      include: {
        _count: {
          select: {
            followers: true,
            likes: true,
            views: true,
          },
        },
      },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          name: fetchedUser.name as string,
          email: fetchedUser.email as string,
          image: getRandomImage(),
        },
        include: {
          _count: {
            select: {
              followers: true,
              likes: true,
              views: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ user: existingUser });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
};
