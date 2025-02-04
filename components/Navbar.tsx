"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/User";

interface NavbarProps {
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <div className="space-x-12 w-full h-24 flex items-center justify-center">
      <Link
        href="/"
        className={`${
          pathname === "/"
            ? "text-slate-400 hover:cursor-pointer"
            : "hover:text-slate-400 hover:cursor-pointer"
        }`}
      >
        Home
      </Link>
      {user ? (
        <Link
          href="/profile"
          className={`${
            pathname === "/profile"
              ? "text-slate-400 hover:cursor-pointer"
              : "hover:text-slate-400 hover:cursor-pointer"
          }`}
        >
          Profile
        </Link>
      ) : (
        <Link
          href="/sign-in"
          className={`${
            pathname === "/sign-in"
              ? "text-slate-400 hover:cursor-pointer"
              : "hover:text-slate-400 hover:cursor-pointer"
          }`}
        >
          Sign In
        </Link>
      )}
      <Link
        href="/posts/search"
        className={`${
          pathname === "/posts/search"
            ? "text-slate-400 hover:cursor-pointer"
            : "hover:text-slate-400 hover:cursor-pointer"
        }`}
      >
        Search
      </Link>
    </div>
  );
};

export default Navbar;
