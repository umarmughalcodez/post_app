import React from "react";
import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import FetchUserPosts from "@/components/FetchUserPosts";

const profile = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="w-full flex items-center justify-center">
      {user ? (
        <div className="">
          <div className="border border-black p-5 rounded-xl grid place-items-center">
            <Image
              src={user?.image as string}
              alt="User's Image"
              width={100}
              height={100}
              className="rounded-full"
            />
            <p className="mt-2">{user?.name}</p>
            {/* <br /> */}
            <p className="mt-2 mb-2">{user?.email}</p>
            {/* <br /> */}
            <Link
              className="bg-red-500 rounded-xl py-1 px-2 text-white cursor-pointer"
              href={"/sign-out"}
            >
              Sign Out
            </Link>
          </div>
          <div className="mt-5">
            <Link
              className="bg-black rounded-xl py-1 px-2 text-white cursor-pointer"
              href={"/posts/create"}
            >
              Create Post
            </Link>
          </div>

          <FetchUserPosts />
        </div>
      ) : (
        <>
          <p>You are not authenticated please sign In first</p>
          <Link href={"/sign-in"}>Sign In</Link>
        </>
      )}
    </div>
  );
};

export default profile;
