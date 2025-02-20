"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { MdDelete } from "react-icons/md";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import { Textarea } from "@/components/ui/textarea";

const CreatePost = () => {
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
        setError("Image size should not exceed 2 mb");
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="text-black mt-24 grid place-items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[50%] p-5 shadow-2xl rounded-xl grid place-items-center"
      >
        <h1 className="text-2xl mb-4">Create Post</h1>
        <Input
          className="mt-3 rounded-lg w-[85%]"
          placeholder="Enter title here..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          max={50}
        />
        <br />
        {/* <SlateEditor value={description} onChange={setDescription} /> */}
        <Textarea
          className="resize-none w-[85%] h-32 mb-1 mt-2 outline-1 p-3"
          placeholder="Enter description here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={700}
        />
        <br />
        {publicId && (
          <>
            <Button
              onClick={handleDeleteImage}
              className="left-[100%] bg-none mb-3"
              // variant={"default"}
            >
              <MdDelete className="bg-none" />
            </Button>
            <CldImage
              src={publicId}
              alt="Post's Image"
              width={250}
              height={250}
            />
          </>
        )}
        <ImageUploader
          onUpload={(uploadedPublicId) => setPublicId(uploadedPublicId)}
        />
        <br />

        {error && <p className="text-red-700">{error}</p>}
        <Button
          variant={"default"}
          type="submit"
          // className="bg-white"
          // disabled={loading}
        >
          create post
        </Button>
        {success && (
          <p className="text-green-600 mt-3 text-lg">
            Post created successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
