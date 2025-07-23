"use client";
import { RootState } from "@/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  userEmail: string;
  _count: {
    views: number;
    likes: number;
    comments: number;
  };
}

const Analytics = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const user = useSelector((state: RootState) => state.user.user);

  const fetchPosts = async () => {
    const res = await fetch("/api/userPosts");
    const data = await res.json();
    setPosts(data.posts || []);
  };
  const followers = user?._count.followers;

  const data = posts.map((post) => ({
    name: post.title.length > 20 ? post.title.slice(0, 20) + "..." : post.title,
    views: post._count?.views || 0,
    likes: post._count?.likes || 0,
    comments: post._count.comments || 0,
    followers: followers || 0,
  }));

  const totalLikes = user?._count.likes;
  const totalViews = user?._count.views;

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="views" fill="#82ca9d" />
          <Bar dataKey="likes" fill="#8884d8" />
          <Bar dataKey="followers" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
