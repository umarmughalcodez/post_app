"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  description: string;
}

const AllPosts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        setPosts(data.data);
        setSuccess(true);
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
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-3">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts?.map((post) => (
          <li
            key={post.id}
            className="border border-white w-60 p-2 rounded-xl cursor-pointer
             hover:bg-slate-900 transition-all delay-150"
            onClick={() => {
              router.push(`/posts/${post.id}`);
            }}
          >
            <p>Title: {post.title}</p>
            <br />
            <p>Description: {post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllPosts;
