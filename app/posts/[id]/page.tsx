"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";
import Image from "next/image";
import Loader from "@/components/Loader";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

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

        const res = await fetch(`/api/posts/${postId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

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

  const notify = () =>
    toast("Link Copied!", {
      duration: 2000,
      icon: "✅",
    });

  const handleCopyLink = async (postId: string) => {
    const url = `http://localhost:3000/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    notify();
    //
  };

  return (
    <div className="h-full w-full grid place-items-center overflow-y-auto overflow-x-hidden">
      <Toaster />
      <div className="grid place-items-center mt-14">
        {post?.image_url && (
          <Image
            src={post?.image_url as string}
            alt="Post's Image"
            width={300}
            height={350}
          />
        )}

        <p className="mt-3 mb-3">
          <b>Title:</b> {post?.title}
        </p>
        <b>Descrption:</b>
        <p className="w-[30%] break-words">{post?.description}</p>
        <Button
          onClick={() => {
            handleCopyLink(post?.id as string);
          }}
          className="bg-green-600 hover:bg-opacity-85 mt-4 mb-3"
        >
          Share
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

      {error && <div className="text-red-700">{error}</div>}
    </div>
  );
};

export default Post;
