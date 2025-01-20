"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";

interface Post {
  // data: {
  id: string;
  title: string;
  description: string;
  // };
}

const Post = () => {
  const params = useParams();
  const postId = params.id;
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletionSuccess, setDeletionSuccess] = useState<boolean>(false);
  const [isFormOpen, setFormOpen] = useState<boolean>(false);

  useEffect(() => {
    setSuccess(null);
    setError(null);

    const fetchPost = async () => {
      try {
        if (!postId || typeof postId !== "string") {
          throw new Error("Invalid post Id");
        }

        const res = await fetch(`/api/posts/${postId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await res.json();
        setPost(data.data);
        setSuccess("Post fetched successfully");

        setTimeout(() => {
          setSuccess(null);
        }, 1500);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occured");
          setTimeout(() => {
            setError(null);
          }, 1500);
        }
        throw new Error("Failed to fetch post");
      }
    };

    fetchPost();
  }, [postId]);

  const deletePost = async () => {
    setSuccess(null);
    setError(null);
    setDeletionSuccess(false);
    setFormOpen(false);
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

  if (!post) {
    return <p>Loading ...</p>;
  }

  if (deletionSuccess) {
    return <div>Post deleted successfully</div>;
  }

  if (isFormOpen) {
    return (
      <div className="relative top-72">
        <div className="absolute bg-gray-600 w-[30%] flex-col flex h-44 space-y-5 items-center justify-center top-[40%] left-[40%]">
          <button
            className=" text-white absolute top-2 right-2"
            onClick={() => {
              setFormOpen(false);
            }}
          >
            <IoCloseSharp />
          </button>
          Do you really want to delete this post?
          <br />
          <button onClick={deletePost} className="bg-red-700">
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <p>Title: {post.title}</p>
      <p>Description: {post.description}</p>
      <br />
      {success && (
        <div className="text-green-700">Post fetched successfully</div>
      )}
      {error && <div className="text-red-700">{error}</div>}
      <button
        onClick={() => {
          router.push(`/posts/edit/${post.id}`);
        }}
      >
        Update Post
      </button>
      <br />
      <button
        onClick={() => {
          setFormOpen(true);
        }}
      >
        Delete Post
      </button>
    </div>
  );
};

export default Post;
