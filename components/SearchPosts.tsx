"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
  const [page, setPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [selectedLimit, setSelectedLimit] = useState<number>(1);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts(keyword, 1);
  };

  useEffect(() => {
    fetchPosts(keyword, page);
  }, [selectedLimit]);

  const fetchPosts = async (searchKeyword: string, page: number) => {
    setError("");
    setShowNotFound(false);
    setLoading(true);
    setPosts([]);

    try {
      const res = await fetch("/api/posts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: searchKeyword,
          page,
          limit: selectedLimit,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to search posts");
      }

      const data = await res.json();
      setPosts(data.matchedPosts || []);
      setTotalPosts(data.totalPosts || 0);

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

  useEffect(() => {
    fetchPosts("", 1);
  }, []);

  const handlePreviousPage = async () => {
    setPage((prevPage) => {
      const prevPageNumber = prevPage > 1 ? prevPage - 1 : 1;
      fetchPosts(keyword, prevPageNumber);
      return prevPageNumber;
    });
  };

  const handleNextPage = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchPosts(keyword, nextPage);
      return nextPage;
    });
  };

  return (
    <div className="w-64 h-32">
      <form onSubmit={handleSearch}>
        <Input
          placeholder="Search Posts..."
          value={keyword as string}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button type="submit">Search</Button>
        <br />
        <select
          value={selectedLimit}
          onChange={(e) => setSelectedLimit(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
        {error && <p className="text-red-700">{error}</p>}
      </form>
      {loading && <p>Loading ...</p>}
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              className="border border-white rounded-xl cursor-pointer"
              onClick={() => {
                router.push(`/posts/${post.id}`);
              }}
            >
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
      <div className="pagination">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </Button>
        <br />
        <br />
        <Button
          onClick={handleNextPage}
          disabled={page * selectedLimit >= totalPosts}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SearchPosts;
