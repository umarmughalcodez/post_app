"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { MdAutoFixHigh, MdDelete } from "react-icons/md";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import { Textarea } from "@/components/ui/textarea";
import ai from "@/public/icons8-sparkle-50.png";
import aiGif from "@/public/icons8-sparkle.gif";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/components/Loader";

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [publicId, setPublicId] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [aiCooldown, setAiCooldown] = useState(false);
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
      toast.success("Post created Successfully!");
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

  const handleAiText = async () => {
    if (aiCooldown) {
      toast.error("Please wait a few seconds...");
      return;
    } // block repeated clicks

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
          messages: [
            {
              role: "user",
              content: `Generate a random and unique social media post. Return:

1. A short and catchy post title (max 12 words) with 1 or 2 relevant hashtags
2. A detailed description (around 80–100 words) that matches the title

Do not include quotation marks, explanations, or any code. Just output plain text in the following format:

Title: <your title here> <hashtag1> <hashtag2>
Description: <your description here>  `.trim(),
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices[0]?.message?.content?.trim();

        if (content) {
          const titleMatch = content.match(/Title:\s*(.*)/);
          const descMatch = content.match(/Description:\s*([\s\S]*)/);

          const titleLine = titleMatch?.[1]?.trim() ?? "";
          const description = descMatch?.[1]?.trim() ?? "";

          setTitle(titleLine);
          setDescription(description);
          setShowAnimation(false);
        }
      }

      if (res.status === 429) {
        toast.error("You are sending too many requests. Wait a few Seconds...");
        setShowAnimation(false);
      }
    } catch (error) {
      throw new Error("Failed to create title and description");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (success) {
    return (
      <div className="h-screen w-screen relative">
        <Loading />
      </div>
    );
  }

  return (
    <div className="text-black mt-24 grid place-items-center">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className={`w-[50%] p-5 shadow-2xl rounded-xl grid place-items-center  relative`}
      >
        <h1 className="text-2xl mb-4">Create Post</h1>
        <div className="absolute top-6 right-6 group">
          {/* Tooltip div - only visible on hover */}
          <div className="bg-gray-500 text-white  px-2 py-1 rounded-2xl absolute -top-16 -right-28 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            AI auto text generation
          </div>

          {/* Image */}
          <Image
            src={showAnimation ? aiGif : ai}
            alt="image"
            width={30}
            height={30}
            className="hover:scale-105 transition-all delay-75 cursor-pointer"
            onClick={() => {
              handleAiText();
              setAiCooldown(true); // start cooldown
              setTimeout(() => setAiCooldown(false), 10000);
              if (!aiCooldown) {
                setShowAnimation(true);
              }
            }}
          />
        </div>

        {/* <MdAutoFixHigh
          
        /> */}
        <Input
          className="mt-3 rounded-lg w-[85%]"
          placeholder="Enter title here..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          max={50}
        />

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
      </form>
    </div>
  );
};

export default CreatePost;
