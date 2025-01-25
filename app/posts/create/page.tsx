"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryUploadEvent {
  event: string;
  info: {
    public_id: string;
    [key: string]: any;
  };
}
const createPost = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [publicId, setPublicId] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      const post = await res.json();
      const postId = post.data.id;
      setSuccess(true);
      setDescription("");
      setTitle("");
      setPublicId("");
      router.push(`/posts/${postId}`);
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter title here..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Enter description here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <label>Image</label>
        {/*  */}
        <CldUploadWidget
          uploadPreset="nextjs_posts"
          onSuccess={(event: any) => {
            setPublicId(event?.info?.public_id);
          }}
        >
          {({ open }) => (
            <button type="button" onClick={() => open?.()}>
              Upload Image
            </button>
          )}
        </CldUploadWidget>

        <button type="submit" disabled={loading}>
          create post
        </button>
      </form>

      {error && <p className="text-red-700">{error}</p>}
      {success && <p className="text-green-600">Post created successfully</p>}
      {loading && <div>Loading ...</div>}
    </div>
  );
};

export default createPost;
