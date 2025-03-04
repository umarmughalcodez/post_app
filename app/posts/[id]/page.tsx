"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";
import Image from "next/image";
import Loader from "@/components/Loader";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import FetchAuthorDetails from "@/components/User/FetchAuthorDetails";
import { RiShareForwardLine } from "react-icons/ri";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { User } from "@/types/User";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  userEmail: string;
}

const Post = () => {
  const params = useParams();
  const postId = params.id;
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletionSuccess, setDeletionSuccess] = useState<boolean>(false);
  const [isFormOpen, setFormOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [likedPosts, setLikedPosts] = useState<string[] | null>(null);
  const [followedUsers, setFollowedUsers] = useState<string[] | null>(null);
  const [authors, setAuthors] = useState<{ [key: string]: User | null }>({});
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setError(null);

    const fetchPost = async () => {
      let user = null;

      try {
        setLoading(true);
        if (!postId || typeof postId !== "string") {
          throw new Error("Invalid post Id");
        }

        const session = await getSession();
        user = session?.user;
        if (!user) {
          throw new Error(
            "You are not authenticated, Please verify Yourself first!"
          );
        }
        setUserEmail(user.email as string);

        const res = await fetch(`/api/posts/${postId}`);

        const data = await res.json();
        setPost(data.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occured");
          setTimeout(() => {
            setError(null);
          }, 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const deletePost = async () => {
    setError(null);
    setFormOpen(false);
    setDeletionSuccess(false);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      setDeletionSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 2500);
      }
    }
  };

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/user/follow?email=${post?.userEmail}`);
      if (res.ok) {
        const isFollowed = followedUsers?.includes(post?.userEmail as string);
        if (isFollowed) {
          toast.success(`${post?.userEmail} Un followed!`);
        } else {
          toast.success(`${post?.userEmail} followed!`);
        }
        fetchFollowedUsers();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const fetchFollowedUsers = async () => {
    const res = await fetch("/api/user/followed-users");
    if (res.ok) {
      const data = await res.json();
      setFollowedUsers(data.followedUsers);
    }
  };

  const fetchLikedPosts = async () => {
    const res = await fetch("/api/user/liked-posts");
    const data = await res.json();
    setLikedPosts(data.likedPosts);
  };

  useEffect(() => {
    fetchLikedPosts();
    fetchFollowedUsers();
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
    fetchLikedPosts();
    fetchFollowedUsers();
    if (post?.userEmail) {
      fetchAuthor(post.userEmail, post.id);
    }
  }, [postId, post?.userEmail]);

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
  if (deletionSuccess) {
    return (
      <div className="w-full grid place-items-center h-full">
        <p className="text-lg text-red-600">Post deleted successfully</p>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (isFormOpen) {
    return (
      <div className="relative top-72">
        <div className="absolute w-[50%] h-48 left-[30%] p-5 grid place-items-center rounded-xl shadow-2xl">
          <button
            className=" text-black absolute top-2 right-2 bg-none text-2xl hover:rotate-180 delay-100 transition-all"
            onClick={() => {
              setFormOpen(false);
            }}
          >
            <IoCloseSharp />
          </button>
          Do you really want to delete this post?
          <br />
          <Button
            variant={"destructive"}
            onClick={deletePost}
            className="bg-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }

  const notify = () => toast.success("Link Copied!");

  const handleCopyLink = async (postId: string) => {
    const url = `http://localhost:3000/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    notify();
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
    <div className="h-full w-full grid place-items-center overflow-y-auto overflow-x-hidden">
      <Toaster />
      <div className="grid place-items-center mt-14">
        {/* {User Details} */}

        {post?.image_url && (
          <Image
            src={post?.image_url as string}
            alt="Post's Image"
            width={300}
            height={350}
          />
        )}

        <p className="mt-3 mb-3">
          <b>Title:</b>{" "}
          {/* <span className="cursor-pointer underline underline-offset-4"> */}
          {highlishtHashtags(post?.title || "")}
          {/* </span> */}
        </p>
        <b>Descrption:</b>
        <p className="w-[70%] break-words">
          {highlishtHashtags(post?.description || "")}
        </p>
        <button
          onClick={() => handleLikePost(post?.id as string)}
          className="bg-none text-red-700 text-xl p-2 hover:bg-slate-200 rounded-full cursor-pointer"
        >
          {likedPosts?.includes(post?.id as string) ? (
            <IoMdHeart />
          ) : (
            <IoMdHeartEmpty />
          )}
        </button>
        {post?.userEmail == userEmail ? null : (
          <Button onClick={handleFollow}>
            {followedUsers?.includes(post?.userEmail as string) ? (
              <span>following @{authors[post?.id as string]?.username}</span>
            ) : (
              <span>follow @{authors[post?.id as string]?.username}</span>
            )}
          </Button>
        )}

        <Button
          onClick={() => {
            handleCopyLink(post?.id as string);
          }}
          className="mt-4 mb-3"
        >
          Share
          <RiShareForwardLine />
        </Button>

        {userEmail === post?.userEmail && (
          <>
            <Button
              className="bg-blue-400 hover:bg-opacity-85 mb-3"
              onClick={() => {
                router.push(`/posts/edit/${post.id}`);
              }}
            >
              Update Post
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                setFormOpen(true);
              }}
            >
              Delete Post
            </Button>
          </>
        )}
      </div>

      <div>
        <FetchAuthorDetails userData={post?.userEmail} />
      </div>

      {error && <div className="text-red-700">{error}</div>}
    </div>
  );
};

export default Post;
