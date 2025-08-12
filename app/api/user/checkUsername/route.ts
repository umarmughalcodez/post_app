import { getUserByUsername } from "@/components/User/GetUserByUsername";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const username = url.searchParams.get("username");
  const userId = url.searchParams.get("userId");

  if (!username || !userId) {
    return NextResponse.json({
      status: 400,
      error: "Username and userId are required",
    });
  }
  try {
    const user = await getUserByUsername(username as string);

    if (user && user.id !== userId) {
      return NextResponse.json({ status: 200, exists: true });
    }

    return NextResponse.json({ status: 200, exists: false });
  } catch (error) {
    return NextResponse.json({ status: 400, error });
  }
};
