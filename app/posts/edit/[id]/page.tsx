"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Post {
  // data: {
  id: string;
  title: string;
  description: string;
  // };
}

const EditPost = () => {
  const params = useParams();
  const postId = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!postId || typeof postId !== "string") {
          throw new Error("Invalid post Id");
        }
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
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!post) {
        throw new Error("Error in fetching the post");
      }

      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      setSuccess(true);
      router.push(`/posts/${postId}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occured");
      }
    }
  };

  if (success) {
    return <p className="text-green-600">Post updated successfully</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (loading) {
    return <p className="">Loading ...</p>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prevPost) => (prevPost ? { ...prevPost, [name]: value } : null));
  };

  return (
    <div>
      <form className="text-black">
        <input
          placeholder="Enter title here..."
          value={post?.title || ""}
          onChange={handleInputChange}
          type="text"
          name="title"
        />
        <br />
        <textarea
          name="description"
          value={post?.description || ""}
          onChange={handleInputChange}
          placeholder="Enter description here..."
        />
        <br />
        <button className="bg-white" type="submit" onClick={handleUpdate}>
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
