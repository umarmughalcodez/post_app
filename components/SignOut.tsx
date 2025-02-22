import { signOut } from "@/auth";
import { Button } from "./ui/button";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/sign-in" });
      }}
    >
      <Button type="submit" variant={"destructive"}>
        Signout
      </Button>
    </form>
  );
}
