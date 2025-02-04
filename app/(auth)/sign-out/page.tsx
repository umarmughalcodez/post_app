import SignOut from "@/components/SignOut";
import React from "react";

const signOut = () => {
  return (
    <div className="w-full grid place-items-center mt-56">
      <p className="mb-5">Are you sure you want to sign out?</p>
      <SignOut />
    </div>
  );
};

export default signOut;
