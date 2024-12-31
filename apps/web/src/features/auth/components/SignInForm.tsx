'use client';

import LoaderButton from '@/components/LoaderButton';
import PasswordInput from '@/components/PasswordInput';
import FormResponse from '@/features/auth/components/FormResponse';
import { useSignInForm } from '@/features/auth/hooks/useSignInForm';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/form';
import { Input } from '@repo/ui/input';

const SignInForm = () => {
  const { form, onSubmit, isPending, error, urlError, isTwoFactorEnabled } = useSignInForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {!isTwoFactorEnabled ? (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input autoComplete="email" type="email" placeholder="Email" autoFocus {...field} />
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
                    <PasswordInput autoComplete="current-password password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormResponse variant="success" description="Please enter the code sent to your email" title="Code sent" />
          </>
        )}

        {(error || urlError) && (
          <FormResponse variant="destructive" description={error || urlError || ''} title="Error" />
        )}

        <div className="pt-2">
          <LoaderButton className="w-full" isPending={isPending}>
            Sign In
            {/* {data && data.twoFactor ? 'Confirm' : 'Sign In'} */}
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
