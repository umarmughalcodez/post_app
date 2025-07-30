import SignIn from "@/components/SignIn";
import React from "react";

const signIn = () => {
  return (
    <div className="w-full flex-col flex justify-center items-center mt-56">
      <p className="mb-20 text-3xl font-semibold">
        Please Sign In first to authenticate yourself!
      </p>
      <SignIn />
    </div>
  );
};

export default signIn;
