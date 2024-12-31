import { useUser } from "@/components/providers/AuthProvider";
import { updateUserAction } from "@/features/user/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@repo/ui/hooks/use-toast";
import { updateUserSchema } from "@repo/validation/user";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export const useUpdateUserForm = () => {
  const { user } = useUser();

  const {
    isPending,
    execute,
    result: { serverError, data },
    hasSucceeded,
  } = useAction(updateUserAction);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      image: user?.image || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    execute(values);
    if (data?.success) {
      form.reset();
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } else {
      toast({
        title: "Failed to update profile",
        description: "Please try again.",
      });
    }
  };

  return {
    form,
    onSubmit,
    isPending,
    error: data?.error || serverError,
    success: data?.success,
    hasSucceeded,
    user,
  };
};
