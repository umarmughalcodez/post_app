import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    console.log(session);

    if (session) {
      return NextResponse.json({ status: 200, session });
    } else {
      return NextResponse.json({ msg: "Failed" });
    }
  } catch (error) {
    return NextResponse.json({ msg: "Failed" });
  }
};
