"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const FetchUserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/userPosts`);
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <ul className="flex space-x-5 m-10">
      {posts.length > 0 ? (
        posts.map((post) => (
          <li
            key={post.id}
            onClick={() => router.push(`/posts/${post.id}`)}
            className="border border-white rounded-xl p-5 cursor-pointer"
          >
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <img
              src={post.image_url}
              alt={post.title}
              width={100}
              height={100}
            />
          </li>
        ))
      ) : (
        <div>No posts available</div>
      )}
    </ul>
  );
};

export default FetchUserPosts;
