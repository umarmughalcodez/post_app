import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="grid place-items-center mt-56 justify-center items-center text-black">
      <Loader2 className="w-16 h-16 text-black animate-spin" />
      <p className="mt-4 text-lg">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
