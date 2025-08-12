import { signOut } from "@/auth";
import { Button } from "./ui/button";
import { clearUser } from "@/store/userSlice";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/sign-in" });
        clearUser();
      }}
    >
      <Button type="submit" variant={"destructive"}>
        Signout
      </Button>
    </form>
  );
}
