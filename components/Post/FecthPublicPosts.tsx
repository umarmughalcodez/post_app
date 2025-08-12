"use client";
import React, { useEffect, useState } from "react";
// import Post from "./Post";
import PostsFeed from "./PostsFeed";

interface FetchPublicPostsProps {
  email: string;
}

const FetchPublicPosts: React.FC<FetchPublicPostsProps> = ({ email }) => {
  const [posts, setPosts] = useState<[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/userPosts?email=${email}`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <ul className="flex space-x-5 m-10">
      {posts.length > 0 ? (
        <PostsFeed data={posts} />
      ) : (
        <div>No posts available</div>
      )}
    </ul>
  );
};

export default FetchPublicPosts;
