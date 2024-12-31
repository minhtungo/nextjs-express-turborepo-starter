import LoaderButton from "@/components/LoaderButton";
import { sendVerificationEmailAction } from "@/features/auth/actions/auth";
import FormResponse from "@/features/auth/components/FormResponse";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";

interface ResendVerificationEmailProps extends React.ComponentProps<"button"> {
  token: string;
}

const ResendVerificationEmail = ({
  className,
  token,
}: ResendVerificationEmailProps) => {
  const {
    result: { serverError: error },
    execute,
    isPending,
    hasSucceeded,
  } = useAction(sendVerificationEmailAction);

  const onResendVerificationEmail = async () => {
    execute({ token });
  };

  return (
    <>
      {error && (
        <FormResponse
          variant="destructive"
          className="mt-4"
          description={error}
          title="Error"
        />
      )}
      {hasSucceeded && (
        <FormResponse
          variant="success"
          title="Success"
          description="Verification email sent"
        />
      )}
      <LoaderButton
        type="button"
        className={cn("w-full", className)}
        onClick={onResendVerificationEmail}
        isPending={isPending}
      >
        Resend Verification Email
      </LoaderButton>
    </>
  );
};

export default ResendVerificationEmail;
