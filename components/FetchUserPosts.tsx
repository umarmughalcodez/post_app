"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Button } from "./ui/button";
import Post from "./Post";

// interface Post {
//   id: string;
//   title: string;
//   description: string;
//   image_url: string;
// }

const FetchUserPosts = () => {
  const [posts, setPosts] = useState<[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/userPosts`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

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

  const handleCopyLink = async (postId: string) => {
    const url = `http://localhost:3000/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    notify();
  };

  return (
    <ul className="flex space-x-5 m-10">
      {/* <ToastContainer
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
      /> */}
      {posts.length > 0 ? <Post data={posts} /> : <div>No posts available</div>}
    </ul>
  );
};

export default FetchUserPosts;
