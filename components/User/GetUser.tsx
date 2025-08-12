"use client";
import { useEffect, useState } from "react";
import Loading from "../Loader";

export default function GetUser() {
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("/api/user/verify");

        const data = await response.json();

        if (response.ok) {
          console.log("Response ok");
        } else {
          console.error("User verification failed:", data.error);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      } finally {
        // setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // if (loading)
  //   return (
  //     <div className="w-full h-full">
  //       <Loading />
  //     </div>
  //   );

  return <></>;
}
