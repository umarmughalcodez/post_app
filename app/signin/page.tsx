import { auth, signIn, signOut } from "@/auth";

const Profile = async () => {
  const session = await auth();

  const user = session?.user;

  return user ? (
    <>
      <h1>Welcome! {user.name}</h1>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  ) : (
    <>
      <h1>You are not authenticated! Please verify first</h1>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/profile" });
        }}
      >
        <button type="submit">Sign In with Google</button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/profile" });
        }}
      >
        <button type="submit">Sign In with GitHub</button>
      </form>
    </>
  );
};

export default Profile;
