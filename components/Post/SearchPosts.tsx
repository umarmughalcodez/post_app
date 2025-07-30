"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
// import Post from "./Post";
import Loader from "@/components/Loader";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loader";
import PostsFeed from "./PostsFeed";

const SearchPosts = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [selectedLimit, setSelectedLimit] = useState<number>(2);
  const searchParams = useSearchParams();
  const word = searchParams.get("keyword") as string;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts(keyword, 1);
  };

  const fetchPosts = useCallback(
    async (searchKeyword: string, page: number) => {
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
        console.log("Posts", data);
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
    },
    [selectedLimit]
  );

  useEffect(() => {
    fetchPosts(keyword, page);
  }, [selectedLimit, page, fetchPosts]);

  useEffect(() => {
    if (!word) {
      fetchPosts("", 1);
    }
  }, [fetchPosts]);

  useEffect(() => {
    setKeyword(word || "");
    fetchPosts(word || "", 1);
  }, [searchParams]);

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full grid place-items-center mt-12">
      <form onSubmit={handleSearch} className="grid place-items-center">
        <div className="inline-block">
          <input
            placeholder="Search Posts..."
            value={keyword as string}
            onChange={(e) => setKeyword(e.target.value)}
            className="mb-10 outline-1 border-gray-600 border px-4 py-1 rounded-full outline-none mx-3"
          />
          <button
            type="submit"
            className="bg-blue-400 px-2 py-1 rounded-full text-white"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-700">{error}</p>}
      </form>
      {posts.length > 0 ? (
        <div className="w-full grid place-items-center">
          {!posts && <Loading />}
          <PostsFeed data={posts} />
        </div>
      ) : (
        showNotFound && <p>Posts Not Found</p>
      )}
      <div className="pagination mt-5 mb-5">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </Button>
        <select
          className="mx-5 bg-green-300 rounded-xl px-2 outline-none hover:bg-gray-300"
          value={selectedLimit}
          onChange={(e) => setSelectedLimit(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>

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
