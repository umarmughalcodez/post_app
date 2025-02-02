"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { MdDelete } from "react-icons/md";
import ImageUploader from "@/components/ImageUploader";

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
      if (!publicId || !title || !description) {
        setError("Please provide all the fields");

        setTimeout(() => {
          setError(null);
        }, 2500);

        return;
      }

      if (title.length < 5) {
        setError("Title must be at least 5 characters long");
        setTimeout(() => {
          setError(null);
        }, 2500);
        return;
      }

      if (description.length < 10) {
        setError("Description must be at least 10 characters long");
        setTimeout(() => {
          setError(null);
        }, 2500);
        return;
      }

      setLoading(true);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, publicId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      const post = await res.json();
      const postId = await post.data.id;
      setSuccess(true);
      setDescription("");
      setTitle("");
      setPublicId("");
      await router.push(`/posts/${postId}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 2500);
      } else {
        setError("An unexpected error occured");
        setTimeout(() => {
          setError(null);
        }, 2500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    setPublicId("");
  };

  return (
    <div className="text-black">
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
        {publicId && (
          <>
            <button onClick={handleDeleteImage}>
              {" "}
              <MdDelete />
            </button>
            <CldImage
              src={publicId}
              alt="Post's Image"
              width={150}
              height={150}
            />
          </>
        )}

        {/* <CldUploadWidget
          uploadPreset="nextjs_posts"
          onSuccess={(event: any) => {
            setPublicId(event?.info?.public_id);
          }}
        >
          {({ open }) => (
            <button type="button" className="bg-white" onClick={() => open?.()}>
              Upload Image
            </button>
          )}
        </CldUploadWidget> */}
        <ImageUploader
          onUpload={(uploadedPublicId) => setPublicId(uploadedPublicId)}
        />
        <br />

        <button type="submit" className="bg-white" disabled={loading}>
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
