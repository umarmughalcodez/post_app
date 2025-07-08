"use client";
import React, { useEffect, useState } from "react";
import Post from "./Post";

const FetchUserPosts = () => {
  const [posts, setPosts] = useState<[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/userPosts`);
        const data = await res.json();
        setPosts(data.posts || []);
        console.log("Fetch Posts", data.posts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <ul className="flex space-x-5 m-10">
      {posts.length > 0 ? <Post data={posts} /> : <div>No posts available</div>}
    </ul>
  );
};

export default FetchUserPosts;
