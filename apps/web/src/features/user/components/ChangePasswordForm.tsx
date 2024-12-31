"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";

import LoaderButton from "@/components/LoaderButton";
import PasswordInput from "@/components/PasswordInput";
import FormResponse from "@/features/auth/components/FormResponse";
import { useChangeUserPassword } from "@/features/user/hooks/useChangeUserPassword";

const ChangeUserPasswordForm = () => {
  const { form, onSubmit, isPending, error } = useChangeUserPassword();

  return (
    <Card className="w-full">
      <CardHeader className="mb-6">
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="w-full space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          {error && (
            <FormResponse
              variant="destructive"
              description={error}
              title="Error"
            />
          )}
          <CardFooter className="justify-end pt-3">
            <LoaderButton type="submit" isPending={isPending}>
              Change Password
            </LoaderButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ChangeUserPasswordForm;
