"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loader";
import Image from "next/image";
import { MdOutlineEdit } from "react-icons/md";
import Link from "next/link";
import FetchUserPosts from "@/components/Post/FetchUserPosts";
import { MdVerified } from "react-icons/md";
import { LuCrown } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setUser } from "@/store/userSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [postBtnDisabled, setPostBtnDisabled] = useState(false);
  const router = useRouter();

  const verifyUser = () => {
    if (!user || !user.email) {
      setLoading(true);
      fetch("/api/user")
        .then((res) => {
          if (!res.ok) {
            console.log("Response", res);
          }
          return res.json();
        })
        .then((data) => {
          dispatch(setUser(data.user));
          setLoading(false);
        });
    }
  };

  const handleCheckLimit = async () => {
    if (!user?.premiumAccountHolder) {
      const res = await fetch("/api/posts/limit");
      if (!res.ok) {
        throw new Error("Failed to fetch limit");
      }

      const data = await res.json();

      if (data.limit >= 5) {
        toast.error(
          "You have reached maximum post creation limit! Upgrade to Pro"
        );
        return;
      } else {
        router.push("/posts/create");
      }
    } else {
      router.push("/posts/create");
    }
  };

  useEffect(() => {
    verifyUser();
    console.log("User", user);
  }, [user, dispatch]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative ">
      <Toaster />
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
          {user?.image && (
            <Image
              src={user?.image as string}
              alt="User's Image"
              width={120}
              height={120}
              className="rounded-full"
            />
          )}
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
          {/* <p className="mt-2">{user.}</p> */}
          <p className="mt-2">{user?.name}</p>
          <p></p>
          {/* <p className="mt-2 mb-2">{user?.email}</p> */}
          <p className="">{user?.bio}</p>
          <p className="">@{user?.username}</p>
          {/* <p>Followers: {user?._count.followers || 0}</p> */}
          <Link
            className="bg-red-500 rounded-xl py-1 px-2 text-white cursor-pointer"
            href={"/sign-out"}
          >
            Sign Out
          </Link>
          <Button
            className="bg-black mt-4 rounded-xl py-1 px-2 text-white cursor-pointer"
            onClick={handleCheckLimit}
          >
            Create Post
          </Button>
        </div>
        <div>
          <FetchUserPosts />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
