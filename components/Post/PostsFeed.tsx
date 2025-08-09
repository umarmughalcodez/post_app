"use client";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  userEmail: string;
  _count: {
    views: number;
    likes: number;
  };
}

interface PostData {
  data: Post[];
}

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaRegEye } from "react-icons/fa";
import { User } from "@/types/User";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { likePost, setLikedPosts, unlikePost } from "@/store/likesSlice";
import {
  followUser,
  setFollowedUsers,
  unfollowUser,
} from "@/store/followersSlice";
import { RiShareForwardLine } from "react-icons/ri";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { socket } from "@/app/socket";
import Loader from "../Loader";
import { setUser } from "@/store/userSlice";

const PostsFeed = (data: PostData) => {
  const dispatch = useDispatch();

  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<{ [key: string]: User | null }>({});
  const [userEmail, setUserEmail] = useState<String | null>(null);
  const likedPosts = useSelector((state: RootState) => state.likes.likedPosts);
  const [likesMap, setLikesMap] = useState<{ [postId: string]: number }>({});
  const followedUsers = useSelector(
    (state: RootState) => state.followers.followedUsers
  );
  const [loading, setLoading] = useState(false);
  const likeTimeouts = useRef<{ [postId: string]: NodeJS.Timeout }>({});
  const followTimeouts = useRef<{ [email: string]: NodeJS.Timeout }>({});
  const user = useSelector((state: RootState) => state.user.user);

  const router = useRouter();

  useEffect(() => {
    setPosts(data.data);
  }, [data]);

  useEffect(() => {
    socket.on("new-post", (post, username: string) => {
      setPosts((prev) => [post, ...prev]);
      toast.success(`${username} crated a new post!`);
    });

    return () => {
      socket.off("new-post");
    };
  }, []);

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

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!user) {
        const session = await getSession();
        if (!session?.user || session.user == undefined) {
          setUserEmail(null);
        }
        dispatch(setUser(session?.user as User));
        setUserEmail(session?.user?.email as string);
      }
    };
    verifyUserEmail();
  }, []);

  const fetchLikedPosts = async () => {
    const res = await fetch("/api/user/liked-posts");
    const data = await res.json();
    dispatch(setLikedPosts(data.likedPosts));
  };

  useEffect(() => {
    fetchLikedPosts();
    fetchFollowedUsers();
  }, []);

  useEffect(() => {
    const likesObj: { [postId: string]: number } = {};
    posts.forEach((post) => {
      if (post && post.id) {
        likesObj[post.id] = post._count?.likes ?? 0;
      }
    });
    setLikesMap(likesObj);
  }, [posts]);

  const handleLikePost = async (postId: string) => {
    if (!userEmail) {
      toast.error("Please Login first!");
      setTimeout(() => {
        router.push("/sign-in");
      }, 800);
    } else {
      const isLiked = likedPosts.includes(postId);

      if (isLiked) {
        dispatch(unlikePost(postId));
        toast("💔 Post unliked!");
        setLikesMap((prev) => ({ ...prev, [postId]: prev[postId] - 1 }));
      } else {
        dispatch(likePost(postId));
        toast("💖 Post Liked!");
        setLikesMap((prev) => ({ ...prev, [postId]: prev[postId] + 1 }));
      }

      if (likeTimeouts.current[postId]) {
        clearTimeout(likeTimeouts.current[postId]);
      }

      likeTimeouts.current[postId] = setTimeout(async () => {
        const res = await fetch(`/api/posts/like?postId=${postId}`);
        if (!res.ok) {
          toast.error("Failed to update like on server");
        } else {
          fetchLikedPosts();
        }
      }, 2500);
    }
  };

  const handleFollow = async (email: string, username: string) => {
    if (!userEmail) {
      toast.error("Please Login first!");
      setTimeout(() => {
        router.push("/sign-in");
      }, 800);
    } else {
      const isFollowed = followedUsers.includes(email);

      if (isFollowed) {
        dispatch(unfollowUser(email));
        toast(`${username} unfollowed!`);
      } else {
        dispatch(followUser(email));
        toast.success(`${username} followed!`);
      }

      if (followTimeouts.current[email]) {
        clearTimeout(followTimeouts.current[email]);
      }

      followTimeouts.current[email] = setTimeout(async () => {
        const res = await fetch(`/api/user/follow?email=${email}`);
        if (!res.ok) {
          toast.error("Failed to update follower on Server-Side");
        } else {
          fetchFollowedUsers();
        }
      }, 2500);
    }
  };

  const fetchFollowedUsers = async () => {
    const res = await fetch("/api/user/followed-users");
    const data = await res.json();
    dispatch(setFollowedUsers(data.followedUsers));
  };

  const highlightHashtags = (text: string) => {
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

  const formatUsername = (username: string | undefined) => {
    if (!username) return null;
    return username.length > 8 ? username.slice(0, 8) + "..." : username;
  };

  if (loading) {
    return <Loader />;
  }

  if (!posts) return <Loader />;

  return (
    <>
      <Toaster />
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="cursor-pointer mb-2 w-auto mt-3"
              />
              <p className="w-[60%] text-center truncate">
                {highlightHashtags(post.title || "")}
              </p>
              <p className="w-[70%] truncate text-center">
                {highlightHashtags(post.description || "")}
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
                          unoptimized
                        />
                        <Link
                          className="hover:underline-offset-4 hover:underline"
                          href={`/profile/public?email=${
                            authors[post.id]?.email
                          }`}
                        >
                          @
                          {authors[post.id]?.username
                            ? formatUsername(authors[post.id]?.username)
                            : null}
                        </Link>
                      </div>
                    )}
              </div>
              <div className="flex items-center gap-1 px-1">
                <FaRegEye className="" /> {post._count.views ?? 0}
              </div>
              <div className="flex text-2xl space-x-3 justify-center w-[95%]">
                {window.location.pathname == "/profile/public" ||
                authors[post.id]?.email == userEmail ? null : (
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
                  )}{" "}
                  {likesMap[post.id] ?? post._count.likes ?? 0}
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
    </>
  );
};

export default PostsFeed;
