"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="space-x-12 w-full h-24 flex items-center justify-center">
      <Link href={"/"} className={pathname === "/" ? "text-slate-400" : ""}>
        Home
      </Link>
      <Link
        href={"/posts/create"}
        className={pathname === "/posts/create" ? "text-slate-400" : ""}
      >
        Create Post
      </Link>
    </div>
  );
};

export default Navbar;
