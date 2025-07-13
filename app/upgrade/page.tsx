"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/types/User";
import { loadStripe } from "@stripe/stripe-js";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { LuCrown } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loader";
import { Loader2 } from "lucide-react";

const Pricing = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const router = useRouter();

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51Qufb1PIwniSDzKONkA6Zj9DOEwyDJw3xFF2NYQP132CsGoDWJnMkdCn2c6uQSnTFJyvKUkcTfGNC1iWgD3a5cyZ00KxH4fvq6"
    );

    const res = await fetch("/api/checkout");

    const session = await res.json();

    if (session.id) {
      stripe?.redirectToCheckout({ sessionId: session.id });
    }
  };

  const fetchUser = async () => {
    const session = await getSession();
    setUser(session?.user as User);

    const res = await fetch(
      `/api/user/publicData?email=${session?.user?.email}`
    );

    const data = await res.json();
    setUser(data.user as User);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleCancelSubscription = async () => {
    const res = await fetch("/api/user/cancelSubscription");
    if (!res.ok) {
      throw new Error("Failed to cancel subscription");
    } else {
      toast.success("Subscription cancelled successfully!");
      router.push("/profile");
    }
  };

  return (
    <div className="w-full h-screen grid place-items-center">
      <Toaster />

      {showLoading ? (
        <div className="w-full h-full grid place-items-center justify-center items-center">
          <div className="justify-center items-center grid place-items-center space-y-5">
            <Loader2 className="w-16 h-16 text-black animate-spin" />
            <p>Redirecting, Please Wait</p>
          </div>
        </div>
      ) : user?.premiumAccountHolder ? (
        <div className="flex flex-col space-y-10 w-full h-90% items-center justify-center">
          <p className="font-semibold flex text-xl">
            You Already have upgraded account &nbsp;&nbsp;
            <LuCrown className="text-yellow-400 font-bold text-2xl" />
          </p>
          <Button onClick={handleCancelSubscription} variant={"destructive"}>
            Cancel Subscription
          </Button>
        </div>
      ) : (
        <div className="w-full flex-col flex space-y-5 items-center justify-center mt-44 font-semibold">
          <p className="text-xl">
            Upgrade your account to premium to enjoy more benefits!
          </p>
          <p className="text-xl">Hot Sale Live Now 🔥🔥🔥</p>
          <span className="text-2xl">Only $19.99</span>
          <Button
            type="button"
            onClick={() => {
              makePayment();
              setShowLoading(true);
            }}
            className="bg-green-600 hover:bg-green-500"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pricing;
