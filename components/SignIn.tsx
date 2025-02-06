import { signIn } from "@/auth";
import { Button } from "./ui/button";
import Image from "next/image";
import google from "@/public/google.webp";
import github from "@/public/github.png";

export default function SignIn() {
  return (
    <div className="flex-col justify-center items-center flex">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/profile" });
        }}
      >
        <Button type="submit">
          <Image src={google} alt="Google Image" width={12} height={12} />
          Signin with Google
        </Button>
      </form>
      <p className="mt-3 mb-3">Or</p>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/profile" });
        }}
      >
        <Button type="submit" variant={"default"}>
          <Image src={github} alt="Github Image" width={12} height={12} />
          Signin with GitHub
        </Button>
      </form>
    </div>
  );
}
