"use client";
import Image from "next/image";
import React, { useState } from "react";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const SearchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowNotFound(false);
    setLoading(true);
    setPosts([]);

    try {
      const res = await fetch("/api/posts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) {
        throw new Error("Failed to search posts");
      }

      const data = await res.json();
      setPosts(data.matchedPosts || []);

      const matchedPosts = Array.isArray(data.matchedPosts)
        ? data.matchedPosts
        : [];

      if (matchedPosts.length === 0) {
        setShowNotFound(true);
        setTimeout(() => {
          setShowNotFound(false);
        }, 2500);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 h-32">
      <form onSubmit={handleSearch}>
        <input
          placeholder="Search Posts..."
          value={keyword as string}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">Search</button>
        {error && <p className="text-red-700">{error}</p>}
      </form>
      {loading && <p>Loading ...</p>}
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border border-white rounded-xl">
              <Image
                src={post.image_url}
                alt="Post's Image"
                width={150}
                height={150}
              />
              <p>Title: {post.title}</p>
              <p>Description: {post.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        showNotFound && <p>Posts Not Found</p>
      )}
    </div>
  );
};

export default SearchPosts;
