// "use client";
// import Image from "next/image";
// import { getSession } from "next-auth/react";
// import Link from "next/link";
// import FetchUserPosts from "../Post/FetchUserPosts";

// const ProfileCard = async () => {
//   const session = await getSession();
//   const user = session?.user;

//   return (
//     <div>
//       {user ? (
//         <div className="w-full h-full grid place-items-center">
//           <div className="space-y-3 grid place-items-center border border-black mt-5 rounded-xl py-12 px-24">
//             <Image
//               src={user?.image as string}
//               alt="User's Image"
//               width={100}
//               height={100}
//               className="rounded-full"
//             />
//             <p className="mt-2">{user?.name}</p>
//             <p className="mt-2 mb-2">{user?.email}</p>
//             <p className="">Bio: Tell about yourself!</p>
//             <Link
//               className="bg-red-500 rounded-xl py-1 px-2 text-white cursor-pointer"
//               href={"/sign-out"}
//             >
//               Sign Out
//             </Link>
//             <Link
//               className="bg-black mt-4 rounded-xl py-1 px-2 text-white cursor-pointer"
//               href={"/posts/create"}
//             >
//               Create Post
//             </Link>
//           </div>

//           <div>
//             <FetchUserPosts />
//           </div>
//         </div>
//       ) : (
//         <>
//           <p>You are not authenticated please sign In first</p>
//           <Link href={"/sign-in"}>Sign In</Link>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProfileCard;

// filepath: /c:/Users/Xcorpion/Desktop/app/app/profile/page.tsx
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import FetchUserPosts from "@/components/Post/FetchUserPosts";
import GetUser from "@/components/User/GetUser";

const Profile = () => {
  return (
    <GetUser>
      {(user) => (
        <div className="w-full flex-col items-center justify-center h-full">
          {user ? (
            <div className="w-full h-full grid place-items-center">
              <div className="space-y-3 grid place-items-center border border-black mt-5 rounded-xl py-12 px-24">
                <Image
                  src={user.image}
                  alt="User's Image"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <p className="mt-2">{user.name}</p>
                <p className="mt-2 mb-2">{user.email}</p>
                <p className="">Bio: Tell about yourself!</p>
                <Link
                  className="bg-red-500 rounded-xl py-1 px-2 text-white cursor-pointer"
                  href={"/sign-out"}
                >
                  Sign Out
                </Link>
                <Link
                  className="bg-black mt-4 rounded-xl py-1 px-2 text-white cursor-pointer"
                  href={"/posts/create"}
                >
                  Create Post
                </Link>
              </div>

              <div>
                <FetchUserPosts />
              </div>
            </div>
          ) : (
            <>
              <p>You are not authenticated. Please sign in first.</p>
              <Link href={"/sign-in"}>Sign In</Link>
            </>
          )}
        </div>
      )}
    </GetUser>
  );
};

export default Profile;
