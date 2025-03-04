"use client";
import { User } from "@/types/User";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loader";
import Image from "next/image";
import { MdOutlineEdit } from "react-icons/md";
import Link from "next/link";
import FetchUserPosts from "@/components/Post/FetchUserPosts";
import { MdVerified } from "react-icons/md";
import { LuCrown } from "react-icons/lu";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      if (err instanceof Error) setError(err?.message as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative ">
      <div className="w-full h-full grid place-items-center ">
        <div
          className="space-y-3 grid place-items-center mt-5 rounded-xl py-12 px-24 relative text-white"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/xcorpion/image/upload/v1740344288/lukxsq8cvmn4wdbtuveg.gif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 4,
          }}
        >
          {user?.premiumAccountHolder ? null : (
            <Link
              href={"/upgrade"}
              className="absolute top-5 left-5 mt-3 rounded-3xl transition-all delay-75 hover:text-yellow-300"
            >
              <div className="flex text-sm space-x-1">
                Upgrade to Pro{" "}
                <span className="text-xl ml-1">
                  <LuCrown />
                </span>
              </div>
            </Link>
          )}

          <Link
            href={`/user/settings`}
            className="absolute top-3 right-5 text-2xl rounded-3xl transition-all delay-75 p-2 hover:bg-slate-200 hover:text-black"
          >
            <MdOutlineEdit />
          </Link>
          <Image
            src={user?.image as string}
            alt="User's Image"
            width={120}
            height={120}
            className="rounded-full"
          />
          {user?.premiumAccountHolder ? (
            <div className="flex space-x-1">
              <span>Premium User</span>
              <span className="text-xl">
                <MdVerified />
              </span>
            </div>
          ) : (
            ""
          )}
          <p className="mt-2">{user?.name}</p>
          <p className="mt-2 mb-2">{user?.email}</p>
          <p className="">{user?.bio}</p>
          <p className="">@{user?.username}</p>
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
    </div>
  );
};

export default ProfilePage;
