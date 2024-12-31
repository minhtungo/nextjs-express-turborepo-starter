import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Info } from "@repo/ui/icons";
import { type VariantProps, cva } from "class-variance-authority";

const formResponseVariants = cva("", {
  variants: {
    variant: {
      success: "",
      destructive: "",
    },
  },
  defaultVariants: {
    variant: "success",
  },
});

export interface FormResponseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formResponseVariants> {
  title: string;
  description: string;
}

const FormResponse = ({
  title,
  description,
  className,
  variant,
  ...props
}: FormResponseProps) => {
  return (
    <Alert variant={variant} className={className} {...props}>
      <Info className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default FormResponse;
