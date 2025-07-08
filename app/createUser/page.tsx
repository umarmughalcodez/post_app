"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface PostProps {
  id: string;
  userEmail: string;
  image_url: string;
  title: string;
  description: string;
  likes: string[];
  followers: string[];
  comments: string[];
}

const PostAnalyticsChart = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);

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

  const chartData = posts.map((post) => ({
    name:
      post.title.length > 10 ? post.title.substring(0, 10) + "..." : post.title,
    Likes: 1002,
    Comments: 1242,
    Followers: 234,
  }));

  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Post Analytics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Likes" fill="#8884d8" />
            <Bar dataKey="Comments" fill="#82ca9d" />
            <Bar dataKey="Followers" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PostAnalyticsChart;
