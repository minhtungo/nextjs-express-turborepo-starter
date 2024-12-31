import { cn } from "@/lib/utils";

const Container = ({
  className,
  children,
  tag: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  tag?: "div" | "main" | "section";
}) => {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", className)}>
      {children}
    </Tag>
  );
};

export default Container;
