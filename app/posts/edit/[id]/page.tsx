"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/Loader";

interface Post {
  // data: {
  id: string;
  title: string;
  description: string;
  publicId: string;
  image_url: string;
  // };
}

const EditPost = () => {
  const params = useParams();
  const postId = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newImageUploaded, setNewImageUploaded] = useState<boolean>(false);

  const [publicId, setPublicId] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
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
          setTimeout(() => {
            setError(null);
          }, 2500);
        } else {
          setError("An unexpected error occured");
          setTimeout(() => {
            setError(null);
          }, 2500);
        }
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!post?.title || !post?.description || !post?.image_url) {
      setError("Please fill all the fields");
      setTimeout(() => {
        setError(null);
      }, 2500);
      return;
    }

    if (post.title.length < 5) {
      setError("Title must be at least 5 characters long");
      setTimeout(() => {
        setError(null);
      }, 2500);
      return;
    }

    if (post.description.length < 10) {
      setError("Description must be at least 10 characters long");
      setTimeout(() => {
        setError(null);
      }, 2500);
      return;
    }

    const updatedPost = {
      ...post,
      image_url: publicId
        ? `https://res.cloudinary.com/xcorpion/image/upload/${publicId}`
        : post?.image_url,
    };

    try {
      setLoading(true);

      if (!post) {
        throw new Error("Error in fetching the post");
      }

      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      setSuccess(true);
      router.push(`/posts/${postId}`);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prevPost) => (prevPost ? { ...prevPost, [name]: value } : null));
  };

  if (loading) {
    return <Loader />;
  }

  const handleUploadError = (error: unknown) => {
    if (typeof error === "string" && error.includes("exceeds")) {
      setError("Max image size is 2mb, please upload a smaller image");
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Please choose an image smaller tha 2mb");
      setTimeout(() => {
        setError("");
      }, 2500);
    }
  };

  const handleUploadSucces = async (event: CloudinaryUploadWidgetResults) => {
    if (event?.info && (event.info as CloudinaryUploadWidgetInfo).public_id) {
      setPublicId((event.info as CloudinaryUploadWidgetInfo).public_id);
      setNewImageUploaded(true);
      // setPublicId(uploadedPublicId);
    }
  };

  return (
    <div className="w-full geid place-items-center mt-24">
      <form className="text-black border-black border p-5 w-[50%] grid place-items-center">
        <Input
          placeholder="Enter title here..."
          value={post?.title || ""}
          onChange={handleInputChange}
          type="text"
          name="title"
        />
        <br />
        <Textarea
          name="description"
          value={post?.description || ""}
          onChange={handleInputChange}
          placeholder="Enter description here..."
          className="resize-none w-[95%] h-32 mb-1 mt-2 outline-1 p-3 outline-gray-600"
        />
        <br />
        {!newImageUploaded && post?.image_url && (
          <>
            <Image
              src={post?.image_url as string}
              alt="Post's Image"
              width={200}
              height={200}
            />
          </>
        )}
        {publicId && (
          <>
            <CldImage
              src={publicId}
              alt="Post's Image"
              width={150}
              height={150}
            />
          </>
        )}

        <CldUploadWidget
          uploadPreset="nextjs_posts"
          // onSuccess={(event: CloudinaryUploadWidgetResults) => {
          //   setPublicId(event?.info?.public_id);
          //   setNewImageUploaded(true);
          // }}
          onSuccess={handleUploadSucces}
          onError={handleUploadError}
          options={{
            sources: ["local"],
            maxFileSize: 2097152,
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              className="bg-blue-400 hover:bg-opacity-85 mt-5 mb-5"
              onClick={() => open?.()}
            >
              Update Image
            </Button>
          )}
        </CldUploadWidget>
        <Button type="submit" onClick={handleUpdate}>
          Update Post
        </Button>
      </form>
      {error && <p className="text-red-700">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </div>
  );
};

export default EditPost;
