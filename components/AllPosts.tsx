"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Button } from "./ui/button";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const AllPosts = () => {
  const router = useRouter();
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

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/posts", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data.data || []);
      } catch (error) {
        if (error instanceof Error) {
        } else {
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCopyLink = async (postId: string) => {
    const url = `http://localhost:3000/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    notify();
  };

  return (
    <div className="m-3">
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
      {posts.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts?.map((post) => (
            <li
              key={post.id}
              className="border border-white w-60 p-2 rounded-xl 
             hover:bg-slate-900 transition-all delay-150 grid place-items-center"
            >
              <Image
                src={post.image_url}
                alt="Post's Image"
                width={150}
                height={150}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/posts/${post.id}`);
                }}
              />
              <p>{post.title}</p>
              <br />
              <p>{post.description}</p>
              <br />
              <Button onClick={() => handleCopyLink(post.id)}>Share</Button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No posts available</div>
      )}
    </div>
  );
};

export default AllPosts;
