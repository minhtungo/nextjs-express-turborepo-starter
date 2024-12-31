import { buttonVariants } from "@repo/ui/button";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 ">
      <h2 className="text-2xl font-bold">Unauthorized</h2>
      <p>Please log in to access this page.</p>
      <Link className={buttonVariants({ variant: "outline" })} href="/">
        Go Home
      </Link>
    </div>
  );
}
