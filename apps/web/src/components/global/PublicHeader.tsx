import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import Container from "@/components/layout/Container";
import { authRoutes } from "@/config";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Suspense } from "react";

const PublicHeader = () => {
  return (
    <header className="h-14 border-b">
      <Container className="flex p-4 h-full w-full items-center gap-x-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <div className="flex gap-x-2 items-center ml-auto">
          <ThemeToggle />
          <Suspense fallback={"Loading..."}>
            <AuthButtons />
          </Suspense>
        </div>
      </Container>
    </header>
  );
};

const AuthButtons = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex gap-x-2 items-center">
      {user ? <SignOutButton /> : <Link href={authRoutes.signIn}>Sign In</Link>}
    </div>
  );
};

export default PublicHeader;
