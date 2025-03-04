"use client";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loader";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Link from "next/link";
import { LuCrown } from "react-icons/lu";
import toast, { Toaster } from "react-hot-toast";

const settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<String | null>(null);
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const fetchUser = async () => {
        setLoading(true);
        const res = await fetch("/api/user/settings");
        const data = await res.json();
        setUser(data.fetchedUser);
      };
      fetchUser();
    } catch (error) {
      throw new Error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const username = user?.username?.toLowerCase();
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (
        !username ||
        username?.length < 3 ||
        username.length > 30 ||
        !usernameRegex.test(username as string)
      ) {
        setError(
          "username's length will be between 3 to 50 characters and can only contain letters, numbers, _, and -"
        );

        return;
      }

      const checkUsernameRes = await fetch(
        `/api/user/checkUsername?username=${user?.username}&userId=${user?.id}`
      );
      const checkUsernameData = await checkUsernameRes.json();
      if (checkUsernameData.exists) {
        setError("Username already exists, try a different one");
        return;
      }

      const bio = user?.bio;
      if (!bio || bio.length < 5 || bio.length > 30) {
        setError("Bio's length must be 3 - 30 characters long");
        return;
      }

      const name = user?.name;
      if (!name || name.length < 5 || name.length > 30) {
        setError("name length must be 3 - 30 characters long");
        return;
      }

      const image = user?.image;
      if (!image) {
        setError("Image is required");
        return;
      }

      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name,
          bio: user?.bio,
          username: username,
          image: user?.image,
        }),
      });

      if (res.status === 409) {
        setError("Username already exists try a different one");
        return;
      }

      if (res.ok) {
        router.push("/profile");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to edit user details");
      }
    }
  };

  const handleUploadSucces = async (event: CloudinaryUploadWidgetResults) => {
    if (event?.info && (event.info as CloudinaryUploadWidgetInfo).secure_url) {
      setUrl((event.info as CloudinaryUploadWidgetInfo).secure_url);
      //   setNewImageUploaded(true);
    }
  };

  const handleUploadError = (error: unknown) => {
    if (typeof error === "string" && error.includes("exceeds")) {
      setError("Max image size is 2mb, please upload a smaller image");
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Please choose an image smaller tha 2mb");
      setTimeout(() => {
        setError("");
      }, 2500);
    }
  };

  const handleCancelSubscription = async () => {
    const res = await fetch("/api/user/cancelSubscription");
    if (!res.ok) {
      throw new Error("Failed to cancel subscription");
    } else {
      toast.success("Subscription successfully cancelled!");
      router.refresh();
    }
  };

  useEffect(() => {
    setUser(user ? { ...user, image: url as string } : null);
  }, [url]);

  if (loading) {
    return <Loading />;
  }

  if (!user) return <Loading />;

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 2000);
  }

  return (
    <div className="w-full h-full grid place-items-center">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="w-[80%] shadow-black shadow-2xl rounded-2xl grid place-items-center p-5 mb-7 space-y-4"
      >
        <div className="w-[80%] flex flex-col items-center justify-center space-y-5">
          <p className="text-4xl font-bold m-5">Update Profile</p>

          {user.image && (
            <div className="image-container">
              <Image
                src={user.image as string}
                alt="User's Image"
                width={170}
                height={170}
                className="rounded-full cursor-pointer hover:opacity-60 transition-opacity duration-300"
              />
            </div>
          )}
          <CldUploadWidget
            uploadPreset="nextjs_posts"
            onSuccess={handleUploadSucces}
            onError={handleUploadError}
            options={{
              sources: ["local"],
              maxFileSize: 2097152,
            }}
          >
            {({ open }) => (
              <Button
                type="button"
                className="bg-blue-400 hover:bg-opacity-85 mt-5 mb-5"
                onClick={() => open?.()}
              >
                Update Image
              </Button>
            )}
          </CldUploadWidget>
          <Input
            required
            placeholder="Enter Name..."
            value={user?.name || ""}
            onChange={(e) =>
              setUser(user ? { ...user, name: e.target.value } : null)
            }
            className="rounded-full w-[70%]"
          />

          <Input
            className="rounded-full w-[70%]"
            required
            placeholder="Enter Username..."
            value={
              user?.username
                ? user.username.startsWith("@")
                  ? user.username
                  : "@" + user.username
                : ""
            }
            onChange={(e) =>
              setUser(
                user
                  ? { ...user, username: e.target.value.replace(/^@/, "") }
                  : null
              )
            }
            max={30}
            min={3}
          />

          <Input
            className="rounded-full w-[70%]"
            required
            placeholder="Enter Bio..."
            value={user?.bio || ""}
            onChange={(e) =>
              setUser(user ? { ...user, bio: e.target.value } : null)
            }
          />

          {user.premiumAccountHolder ? (
            <div className="flex text-yellow-400">
              Premium Account Holder &nbsp;&nbsp;
              <span className="text-xl ">
                <LuCrown />
              </span>
              &ensp;&ensp;&ensp;{" "}
              <Button
                variant={"destructive"}
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </Button>
            </div>
          ) : (
            <Link href={"/upgrade"}>Upgrade to Pro</Link>
          )}

          {error && <div className="text-red-500">{error}</div>}
          <Button type="submit">Update Profile</Button>
        </div>
      </form>
    </div>
  );
};

export default settings;
