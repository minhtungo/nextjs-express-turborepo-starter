import { signUpAction } from "@/features/auth/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@repo/validation/auth";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export const useSignUpForm = () => {
  const {
    isPending,
    execute,
    result: { serverError, data },
    hasSucceeded,
  } = useAction(signUpAction);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await execute(values);
    if (hasSucceeded) {
      form.reset();
    }
  };

  return {
    form,
    onSubmit,
    isPending,
    error: data?.error || serverError,
    hasSucceeded,
    success: data?.success,
  };
};
