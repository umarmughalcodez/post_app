"use client";
import { User } from "@/types/User";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loader";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { MdVerified } from "react-icons/md";
import FetchPublicPosts from "@/components/Post/FecthPublicPosts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  followUser,
  setFollowedUsers,
  unfollowUser,
} from "@/store/followersSlice";

const PublicProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedUser, setFecthedUser] = useState<User | null>(null);
  const [followersCount, setfollowersCount] = useState<number>(0);
  const followedUsers = useSelector(
    (state: RootState) => state.followers.followedUsers
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const fetchUser = async () => {
    const session = await getSession();
    setFecthedUser(session?.user as User);
    try {
      setLoading(true);
      const res = await fetch(`/api/user/publicData?email=${email}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await res.json();
      setUser(data.user as User);
      console.log(data.user);
    } catch (err) {
      if (err instanceof Error) setError(err?.message as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFollowedUsers();
  }, []);

  const handleFollow = async (email: string, username: string) => {
    const res = await fetch(`/api/user/follow?email=${email}`);
    if (res.ok) {
      const isFollowed = followedUsers?.includes(email);
      if (isFollowed) {
        dispatch(unfollowUser(email));
        toast.success(`@${username} Unfollowed!`);
        setfollowersCount((prev) => prev - 1);
      } else {
        dispatch(followUser(email));
        toast.success(`@${username} followed!`);
        setfollowersCount((prev) => prev + 1);
      }
      fetchFollowedUsers();
    }
  };

  const fetchFollowedUsers = async () => {
    const res = await fetch("/api/user/followed-users");
    const data = await res.json();
    dispatch(setFollowedUsers(data.followedUsers));
    setfollowersCount(data.followedUsers.length);
  };

  useEffect(() => {
    if (fetchedUser) {
      if (fetchedUser?.email === email) {
        router.push("/profile");
      }
    }
  }, [email, fetchedUser]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!user?.email) return <Loading />;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative ">
      <Toaster />

      <div className="w-full h-full grid place-items-center ">
        <div
          className="space-y-3 grid place-items-center mt-5 rounded-xl py-12 px-24 relative text-white"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/xcorpion/image/upload/v1740344170/vekoh517npn2b70t910g.gif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 4,
          }}
        >
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
          <p className="mt-2">
            {followersCount}{" "}
            {user._count.followers > 1 ? "Followers" : "Follower"}{" "}
          </p>
          {/* <p className="mt-2 mb-2">{user?.email}</p> */}
          <p className="">{user?.bio}</p>
          <p className="">@{user?.username}</p>
          <Button
            onClick={() => handleFollow(user.email, user.username as string)}
          >
            {followedUsers?.includes(user.email as string) ? (
              <span>Following</span>
            ) : (
              <span>Follow</span>
            )}
          </Button>
        </div>
        <div>
          <FetchPublicPosts email={email as string} />
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
