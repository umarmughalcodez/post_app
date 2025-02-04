import { signIn } from "@/auth";
import { Button } from "./ui/button";

export default function SignIn() {
  return (
    <div className="flex-col justify-center items-center flex">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/profile" });
        }}
      >
        <Button type="submit">Signin with Google</Button>
      </form>
      <p className="mt-3 mb-3">Or</p>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/profile" });
        }}
      >
        <Button type="submit" variant={"default"}>
          Signin with GitHub
        </Button>
      </form>
    </div>
  );
}
