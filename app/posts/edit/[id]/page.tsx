"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { MdDelete } from "react-icons/md";

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
    return <p className="">Loading ...</p>;
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
        {!newImageUploaded && post?.image_url && (
          <>
            <Image
              src={post?.image_url as string}
              alt="Post's Image"
              width={150}
              height={150}
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
          onSuccess={(event: any) => {
            setPublicId(event?.info?.public_id);
            setNewImageUploaded(true);
          }}
          onError={handleUploadError}
          options={{
            sources: ["local"],
            maxFileSize: 2097152,
          }}
        >
          {({ open }) => (
            <button type="button" onClick={() => open?.()}>
              Update Image
            </button>
          )}
        </CldUploadWidget>
        <button className="bg-white" type="submit" onClick={handleUpdate}>
          Update Post
        </button>
      </form>
      {error && <p className="text-red-700">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </div>
  );
};

export default EditPost;
