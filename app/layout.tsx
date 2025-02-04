import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"], // Add the weights you need
});

export const metadata: Metadata = {
  title: "Next App",
  description: "...",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user: any = session?.user;

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {/* <ThemeProvider attribute="class" defaultTheme="system"> */}
        <Navbar user={user} />
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
