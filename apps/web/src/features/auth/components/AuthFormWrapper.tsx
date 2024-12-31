import { cn } from "@/lib/utils";
import { buttonVariants } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthFormWrapperProps {
  children?: ReactNode;
  title: string;
  description?: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  className?: string;
  noBorderMobile?: boolean;
}

const AuthFormWrapper = ({
  children,
  title,
  backButtonHref,
  backButtonLabel,
  description,
  className,
}: AuthFormWrapperProps) => {
  return (
    <Card className="mx-auto w-full max-w-[500px] border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn(className)}>
        {children}
        {backButtonHref && backButtonLabel && (
          <BackButton
            className="mt-6"
            href={backButtonHref}
            label={backButtonLabel}
            variant="outline"
          />
        )}
      </CardContent>
    </Card>
  );
};

interface BackButtonProps extends VariantProps<typeof buttonVariants> {
  href: string;
  label: string;
  className: string;
}

const BackButton = ({
  variant,
  size,
  className,
  href,
  label,
}: BackButtonProps) => {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }), "w-full")}
      href={href}
    >
      {label}
    </Link>
  );
};

export default AuthFormWrapper;
