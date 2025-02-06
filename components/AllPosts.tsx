"use client";
import React, { useState, useEffect } from "react";
import Post from "./Post";
import Loader from "@/components/Loader";
import { Button } from "./ui/button";

const AllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(4);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const fetchPosts = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/posts?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPosts(data.data.posts || []);
      setTotalPosts(data.data.totalPosts || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page, limit);
  }, [page, limit]);

  const totalPages = Math.ceil(totalPosts / limit);

  const handleNextPage = () =>
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const handlePreviousPage = () =>
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  const handleFirstPage = () => setPage(1);
  const handleLastPage = () => setPage(totalPages);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="m-3 grid place-items-center">
      <Post data={posts} />
      <div className="pagination-controls mt-4">
        <Button
          onClick={handleFirstPage}
          disabled={page === 1}
          className="mr-2"
        >
          First
        </Button>
        <Button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="mr-2"
        >
          Previous
        </Button>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="bg-blue-300 mx-2 rounded-full px-1 outline-none"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option
              key={num}
              value={num}
              className="bg-gray-300 hover:bg-stone-500"
            >
              {num}
            </option>
          ))}
        </select>
        <Button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="mr-2"
        >
          Next
        </Button>
        <Button
          onClick={handleLastPage}
          disabled={page === totalPages}
          className="mr-2"
        >
          Last
        </Button>
      </div>
    </div>
  );
};

export default AllPosts;
