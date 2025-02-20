"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { Button } from "../ui/button";
import toast, { Toaster } from "react-hot-toast";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

interface PostData {
  data: Post[];
}

const Post = (data: PostData) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    setPosts(data.data);
  }, [data]);

  if (!posts) {
    return <Loader />;
  }

  const notify = () =>
    toast("Link Copied!", {
      duration: 2000,
      icon: "✅",
    });

  const handleCopyLink = async (postId: string) => {
    const url = `http://localhost:3000/posts/${postId}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <Toaster />

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts?.length > 0 ? (
          posts?.map((post) => (
            <li
              key={post.id}
              className="p-3 shadow-lg m-3 rounded-xl flex-col flex items-center justify-center hover:border-none hover:shadow-2xl transition-all delay-75 shadow-black hover:scale-110"
            >
              <Image
                src={post.image_url}
                alt="Post's Image"
                width={250}
                height={250}
                onClick={() => router.push(`/posts/${post.id}`)}
                className="cursor-pointer mt-1 mb-2 w-auto"
              />
              <p className="w-[60%] text-center truncate">{post.title}</p>
              <p className="w-[70%] truncate text-center">{post.description}</p>
              <Button
                onClick={() => {
                  handleCopyLink(post.id);
                  notify();
                }}
              >
                Share
              </Button>
            </li>
          ))
        ) : (
          <p>No Posts Available</p>
        )}
      </ul>
    </div>
  );
};

export default Post;
