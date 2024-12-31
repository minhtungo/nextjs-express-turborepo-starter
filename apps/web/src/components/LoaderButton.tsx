"use client";

import Spinner from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@repo/ui/button";

interface LoaderButtonProps extends ButtonProps {
  isPending: boolean;
}

const LoaderButton = ({
  className,
  children,
  isPending,
  disabled,
  type = "submit",
  ...props
}: LoaderButtonProps) => {
  return (
    <Button
      type={type}
      disabled={disabled || isPending}
      className={cn(className)}
      {...props}
    >
      {children}
      {isPending && <Spinner />}
    </Button>
  );
};

export default LoaderButton;
