"use client";

import LoaderButton from "@/components/LoaderButton";
import { signOutAction } from "@/features/auth/actions/auth";
import { useAction } from "next-safe-action/hooks";

const SignOutButton = () => {
  const { execute: signOut, isPending } = useAction(signOutAction);

  return (
    <LoaderButton
      type="button"
      isPending={isPending}
      onClick={() => signOut()}
      size="sm"
    >
      Sign out
    </LoaderButton>
  );
};

export default SignOutButton;
