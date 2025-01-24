import React from "react";
import { auth } from "@/auth";
import Link from "next/link";

const Profile = async () => {
  const session = await auth();
  const user = session?.user;

  return user ? (
    <h1>Welcome to profile</h1>
  ) : (
    <div>
      please authenticate first <Link href={"/signin"}>Login</Link>
    </div>
  );
};

export default Profile;
