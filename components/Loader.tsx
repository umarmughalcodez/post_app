import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center  text-black">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-black animate-spin" />
      </div>
      <p className="mt-4 text-lg">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
