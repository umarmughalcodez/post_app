"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import loading from "@/public/loading.gif";
import Image from "next/image";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("Verifying payment...");
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setStatus("✅ Payment Verified! Redirecting to profile...");
        setTimeout(() => router.push("/profile"), 3000);
      } else {
        setStatus("❌ Payment verification failed.");
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
}
