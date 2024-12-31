import { cn } from "@/lib/utils";
import { buttonVariants } from "@repo/ui/button";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";

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

export default BackButton;
