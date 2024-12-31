import FormResponse from "@/features/auth/components/FormResponse";
import { useSearchParams } from "next/navigation";

const AuthError = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("errorMessage");
  if (!message) return null;

  return (
    <FormResponse
      variant="destructive"
      description={message}
      title="Authentication Error"
    />
  );
};

export default AuthError;
