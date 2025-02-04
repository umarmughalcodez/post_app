"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";
import Image from "next/image";
// import { auth } from "@/auth";
import { getSession } from "next-auth/react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  userEmail: string;
}

interface Session {
  user: {
    email: string;
  };
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
      try {
        setLoading(true);
        if (!postId || typeof postId !== "string") {
          throw new Error("Invalid post Id");
        }

        const session = await getSession();
        const user = session?.user;
        if (!user) {
          throw new Error(
            `User not authenticated, Please verify yourself first`
          );
        }
        setUserEmail(user.email as string);

        const res = await fetch(`/api/posts/${postId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // if (!res.ok) {
        //   throw new Error("Failed to fetch post");
        // }

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
        router.push("/");
      }, 1500);
    } catch (error) {}
  };

  // if (userEmail !== post?.userEmail) {
  //   return <p>You are not the author of this post</p>;
  // }

  if (deletionSuccess) {
    return <div>Post deleted successfully</div>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (isFormOpen) {
    return (
      <div className="relative top-72">
        <div className="absolute bg-gray-600 w-[30%] flex-col flex h-44 space-y-5 items-center justify-center top-[40%] left-[40%]">
          <Button
            className=" text-white absolute top-2 right-2"
            onClick={() => {
              setFormOpen(false);
            }}
          >
            <IoCloseSharp />
          </Button>
          Do you really want to delete this post?
          <br />
          <Button onClick={deletePost} className="bg-red-700">
            Delete
          </Button>
        </div>
      </div>
    );
  }

  const notify = () =>
    toast.success("Link Copied!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

  const handleCopyLink = async (postId: string) => {
    const url = `http://localhost:3000/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    notify();
  };

  return (
    <div className="h-full w-full">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
      />
      <p>{post?.title}</p>
      <p>{post?.description}</p>
      <br />
      {post?.image_url && (
        <Image
          src={post?.image_url as string}
          alt="Post's Image"
          width={150}
          height={150}
        />
      )}
      <Button onClick={() => handleCopyLink(post?.id as string)}>Share</Button>

      {userEmail === post?.userEmail && (
        <>
          <Button
            onClick={() => {
              router.push(`/posts/edit/${post.id}`);
            }}
          >
            Update Post
          </Button>
          <br />
          <Button
            onClick={() => {
              setFormOpen(true);
            }}
          >
            Delete Post
          </Button>
        </>
      )}

      {error && <div className="text-red-700">{error}</div>}
    </div>
  );
};

export default Post;
