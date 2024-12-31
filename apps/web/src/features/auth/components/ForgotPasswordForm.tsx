"use client";

import LoaderButton from "@/components/LoaderButton";
import FormResponse from "@/features/auth/components/FormResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

import { useForgotPasswordForm } from "@/features/auth/hooks/useForgotPassword";

const ForgotPasswordForm = () => {
  const { form, onSubmit, isPending, error, success } = useForgotPasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Email" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <FormResponse
            variant="destructive"
            description={error}
            title="Error"
          />
        )}
        {success && (
          <FormResponse
            variant="success"
            description={success}
            title="Success"
          />
        )}
        <LoaderButton className="w-full" isPending={isPending}>
          Reset Password
        </LoaderButton>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
