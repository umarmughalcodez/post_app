"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const Post = (data: any) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    setPosts(data.data);
  }, [data]);

  if (!posts) {
    return <Loader />;
  }

  return (
    <div>
      <ul>
        {posts?.length > 0 ? (
          posts?.map((post) => (
            <li
              key={post.id}
              className="p-3 shadow-lg m-3 rounded-xl flex-col flex items-center justify-center hover:border-none hover:shadow-2xl transition-all delay-75 shadow-black hover:scale-110"
            >
              <Image
                src={post.image_url}
                alt="Post's Image"
                width={250}
                height={250}
                onClick={() => router.push(`/posts/${post.id}`)}
                className="cursor-pointer mt-1"
              />
              <p>{post.title}</p>
              <p>{post.description}</p>
            </li>
          ))
        ) : (
          <p>No Posts Available</p>
        )}
      </ul>
    </div>
  );
};

export default Post;
