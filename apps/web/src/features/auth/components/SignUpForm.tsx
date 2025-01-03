'use client';

import LoaderButton from '@/components/LoaderButton';
import PasswordInput from '@/components/PasswordInput';
import FormResponse from '@/features/auth/components/FormResponse';
import { useSignUpForm } from '@/features/auth/hooks/useSignUpForm';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/form';
import { Input } from '@repo/ui/input';

const SignUpForm = () => {
  const { form, onSubmit, isPending, error, success } = useSignUpForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

        {error && <FormResponse variant="destructive" title="Error" description={error} />}
        {success && <FormResponse variant="success" title="Success" description={success} />}

        <LoaderButton className="w-full" isPending={isPending}>
          Sign up
        </LoaderButton>
      </form>
    </Form>
  );
};

export default SignUpForm;
