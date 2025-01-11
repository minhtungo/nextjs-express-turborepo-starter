'use client';

import LoaderButton from '@/components/LoaderButton';
import FormResponse from '@/features/auth/components/FormResponse';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/form';

import PasswordInput from '@/components/PasswordInput';
import { useResetPasswordForm } from '@/features/auth/hooks/useResetPasswordForm';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { form, onSubmit, isPending, error, success } = useResetPasswordForm(token);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormResponse variant="destructive" description={error} title="Error" />}
        {success && <FormResponse description={success} title="Success" variant="success" />}
        <LoaderButton className="w-full" isPending={isPending}>
          Reset Password
        </LoaderButton>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
