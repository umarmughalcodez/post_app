import React from "react";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import FetchUserPosts from "@/components/FetchUserPosts";

const profile = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="w-full flex-col items-center justify-center h-full">
      {user ? (
        <div className="w-full h-full grid place-items-center">
          <div className="grid place-items-center border border-black mt-5 rounded-xl py-12 px-24">
            <Image
              src={user?.image as string}
              alt="User's Image"
              width={100}
              height={100}
              className="rounded-full"
            />
            <p className="mt-2">{user?.name}</p>
            <p className="mt-2 mb-2">{user?.email}</p>
            <Link
              className="bg-red-500 rounded-xl py-1 px-2 text-white cursor-pointer"
              href={"/sign-out"}
            >
              Sign Out
            </Link>
            <Link
              className="bg-black mt-4 rounded-xl py-1 px-2 text-white cursor-pointer"
              href={"/posts/create"}
            >
              Create Post
            </Link>
          </div>

          <div>
            <FetchUserPosts />
          </div>
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
