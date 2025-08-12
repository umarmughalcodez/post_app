"use client";
import React, { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import Image from "next/image";
import { User } from "@/types/User";
import Loading from "../Loader";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

const FetchAuthorDetails = ({ userData }: { userData: string | undefined }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const fetchAuthor = async () => {
    try {
      const userEmail = userData;
      const res = await fetch(`/api/user/publicData?email=${userEmail}`);
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch User details");
      }
    }
  };

  const fetchUser = async () => {
    const session = await getSession();
    setFetchedUser(session?.user as User);
  };

  useEffect(() => {
    fetchUser();
    fetchAuthor();
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };

  if (!user) {
    return (
      <div className="w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          onClick={() => router.push(`/profile/public?email=${user.email}`)}
        >
          {user.email == fetchedUser?.email ? (
            <span>Created by You</span>
          ) : (
            <span>Created by @{user?.username}</span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 h-24">
        <div className="flex justify-between space-x-2">
          <Image
            src={user?.image as string}
            alt="User's Image"
            width={50}
            height={50}
            className="rounded-full hover:cursor-pointer"
            onClick={() => router.push(`/profile/${user.username}`)}
          />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold mt-1">
              <span
                className="truncate w-[100%] text-center hover:underline-offset-2 hover:underline hover:cursor-pointer"
                onClick={() =>
                  router.push(`/profile/public?email=${user.email}`)
                }
              >
                {user?.name}
              </span>
            </h4>

            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">
                Post created at <br /> {formatDate(user?.created_at)}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default FetchAuthorDetails;
