'use client';

import Spinner from '@/components/Spinner';
import { Button, ButtonProps } from '@repo/ui/button';
import { cn } from '@/lib/utils';

interface LoaderButtonProps extends ButtonProps {
  isPending: boolean;
}

const LoaderButton = ({ className, children, isPending, disabled, type = 'submit', ...props }: LoaderButtonProps) => {
  return (
    <Button type={type} disabled={disabled || isPending} className={cn(className)} {...props}>
      {children}
      {isPending && <Spinner />}
    </Button>
  );
};

export default LoaderButton;
