"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const AllPosts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
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
        setPosts(data.data || []);
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

  const handleCopyLink = async (postId: string) => {
    const url = `http://localhost:3000/posts/${postId}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="m-3">
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
              <button onClick={() => handleCopyLink(post.id)}>Share</button>
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
