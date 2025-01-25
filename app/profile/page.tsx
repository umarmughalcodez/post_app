import React from "react";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";

const Profile = async () => {
  const session = await auth();
  const user = session?.user;

  return user ? (
    <>
      <h1>Welcome to profile</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <Image
        src={user.image as string}
        width={50}
        height={50}
        alt={`${user.name}'s Image`}
      />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  ) : (
    <div>
      please authenticate first <Link href={"/signin"}>Login</Link>
    </div>
  );
};

export default Profile;
