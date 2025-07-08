"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";
import google from "@/public/google.webp";
import github from "@/public/github.png";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { redirect } from "next/navigation";

export default function SignIn() {
  const dispatch = useDispatch();

  const handleSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { redirectTo: "/profile" });

      // const res = await fetch("/api/user");
      // if (!res.ok) throw new Error("Failed to fetch user");

      // const data = await res.json();
      // dispatch(setUser(data.user));

      // redirect("/profile");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="flex-col justify-center items-center flex">
      <Button onClick={() => handleSignIn("google")}>
        <Image src={google} alt="Google Image" width={12} height={12} />
        Sign in with Google
      </Button>

      <p className="mt-3 mb-3">Or</p>

      <Button onClick={() => handleSignIn("github")}>
        <Image src={github} alt="Github Image" width={12} height={12} />
        Sign in with GitHub
      </Button>
    </div>
  );
}
