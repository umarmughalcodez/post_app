import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { User } from "@/types/User";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"], // Add the weights you need
});

export const metadata: Metadata = {
  title: "Xenso",
  description: "Simple App going to be ...",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user: User | null = session?.user as User | null;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
