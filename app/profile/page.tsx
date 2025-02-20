"use client";
import { User } from "@/types/User";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loader";
import Image from "next/image";
import { MdOutlineEdit } from "react-icons/md";
import Link from "next/link";
import FetchUserPosts from "@/components/Post/FetchUserPosts";

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
        {/* <div className="profile-card space-y-3 grid place-items-center border border-black mt-5 rounded-xl py-12 px-24 relative"> */}
        <div
          className="space-y-3 grid place-items-center mt-5 rounded-xl py-12 px-24 relative text-white"
          style={{
            backgroundImage:
              "url('https://nodes.upnetwork.xyz/points/img/gif/ani-bg-03b.gif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 4,
          }}
        >
          <Link
            href={`/user/settings`}
            className="absolute top-5 right-5 text-2xl rounded-3xl transition-all delay-75 p-2 hover:bg-slate-200"
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
