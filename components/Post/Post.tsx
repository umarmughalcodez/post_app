"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import toast, { Toaster } from "react-hot-toast";
import { IoMdHeartEmpty } from "react-icons/io";
import { RiShareForwardLine } from "react-icons/ri";
import { IoMdHeart } from "react-icons/io";
import { User } from "@/types/User";
import { Button } from "../ui/button";
import { getSession } from "next-auth/react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  userEmail: string;
}

interface PostData {
  data: Post[];
}

const Post = (data: PostData) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<{ [key: string]: User | null }>({});
  const [user, setUser] = useState<User | null>(null);

  const [likedPosts, setLikedPosts] = useState<string[] | null>(null);
  const [followedUsers, setFollowedUsers] = useState<string[] | null>(null);

  const router = useRouter();

  useEffect(() => {
    setPosts(data.data);
  }, [data]);

  if (!posts) {
    return <Loader />;
  }

  const fetchAuthor = async (email: string, postId: string) => {
    try {
      const res = await fetch(`/api/user/publicData?email=${email}`);
      if (!res.ok) {
        throw new Error("Failed to fetch author data");
      }
      const data = await res.json();
      setAuthors((prevAuthors) => ({
        ...prevAuthors,
        [postId]: data.user as User,
      }));
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };

  const fetchUser = async () => {
    const session = await getSession();
    setUser(session?.user as User);
  };

  useEffect(() => {
    posts.forEach((post) => {
      fetchAuthor(post.userEmail, post.id);
    });
  }, [posts]);

  const notify = () =>
    toast.success("Link Copied!", {
      duration: 2000,
    });

  const handleCopyLink = async (postId: string) => {
    const url = `${window.location.origin}/posts/${postId}`;
    await navigator.clipboard.writeText(url);
  };

  const fetchLikedPosts = async () => {
    const res = await fetch("/api/user/liked-posts");
    const data = await res.json();
    setLikedPosts(data.likedPosts);
  };

  useEffect(() => {
    fetchLikedPosts();
    fetchFollowedUsers();
    fetchUser();
  }, []);

  const handleLikePost = async (postId: string) => {
    const res = await fetch(`/api/posts/like?postId=${postId}`);

    if (res.ok) {
      const isLiked = likedPosts?.includes(postId);
      if (isLiked) {
        toast("💔 Post unliked!");
      } else {
        toast("💖 Post Liked!");
      }
      fetchLikedPosts();
    } else {
      toast.error("Failed to like post");
    }
  };

  const handleFollow = async (email: string, username: string) => {
    const res = await fetch(`/api/user/follow?email=${email}`);
    if (res.ok) {
      const isFollowed = followedUsers?.includes(email);
      if (isFollowed) {
        toast.success(`@${username} Un followed!`);
      } else {
        toast.success(`@${username} followed!`);
      }
      fetchFollowedUsers();
    }
  };

  const fetchFollowedUsers = async () => {
    const res = await fetch("/api/user/followed-users");
    const data = await res.json();
    setFollowedUsers(data.followedUsers);
  };

  const highlishtHashtags = (text: string) => {
    const parts = text.split(/(\s+)/).map((part, index) => {
      if (part.startsWith("#")) {
        const keyword = part.substring(1);
        return (
          <span
            key={index}
            onClick={() => {
              router.push(`/posts/search?keyword=${keyword}`);
            }}
            className="text-blue-400 hover:underline hover:underline-offset-4 cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
    return <>{parts}</>;
  };

  return (
    <div>
      <Toaster />

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts?.length > 0 ? (
          posts?.map((post) => (
            <li
              key={post.id}
              className="p-3 shadow-md m-3 rounded-xl flex-col flex items-center justify-center hover:border-none transition-all delay-75 hover:shadow-black hover:shadow-lg"
            >
              <Image
                src={post.image_url as string}
                alt="Post's Image"
                width={250}
                height={250}
                onClick={() => router.push(`/posts/${post.id}`)}
                className="cursor-pointer mt-1 mb-2 w-auto"
              />
              <p className="w-[60%] text-center truncate">
                {highlishtHashtags(post.title || "")}
              </p>
              <p className="w-[70%] truncate text-center">
                {highlishtHashtags(post.description || "")}
              </p>
              <div className="userDetails flex m-1 space-x-2">
                {window.location.pathname == "/profile/public" ||
                window.location.pathname == "/profile"
                  ? null
                  : authors[post.id]?.image && (
                      <div className="flex items-center space-x-2">
                        <Image
                          src={authors[post.id]?.image as string}
                          alt="User's Image"
                          width={30}
                          height={30}
                          className="rounded-full cursor-pointer"
                        />
                        <Link
                          className="hover:underline-offset-4 hover:underline"
                          href={`/profile/public?email=${
                            authors[post.id]?.email
                          }`}
                        >
                          @{authors[post.id]?.username}
                        </Link>
                      </div>
                    )}
              </div>
              <div className="flex text-2xl space-x-3 justify-center w-[95%]">
                {window.location.pathname == "/profile/public" ? null : authors[
                    post.id
                  ]?.email == user?.email ? null : (
                  <Button
                    className="w-[60%]"
                    onClick={() =>
                      handleFollow(
                        authors[post.id]?.email as string,
                        authors[post.id]?.username as string
                      )
                    }
                  >
                    <span className="w-full truncate">
                      {followedUsers?.includes(
                        authors[post.id]?.email as string
                      ) ? (
                        <span>following @{authors[post.id]?.username}</span>
                      ) : (
                        <span>follow @{authors[post.id]?.username}</span>
                      )}
                    </span>
                  </Button>
                )}

                <button
                  onClick={() => handleLikePost(post.id as string)}
                  className="bg-none text-red-700 text-xl p-2 hover:bg-slate-200 rounded-full cursor-pointer"
                >
                  {likedPosts?.includes(post.id) ? (
                    <IoMdHeart />
                  ) : (
                    <IoMdHeartEmpty />
                  )}
                </button>
                <button
                  onClick={() => {
                    handleCopyLink(post.id);
                    notify();
                  }}
                  className="bg-none text-black text-xl p-2 hover:bg-slate-200 rounded-full cursor-pointer"
                >
                  <RiShareForwardLine />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No Posts Available</p>
        )}
      </ul>
    </div>
  );
};

export default Post;
