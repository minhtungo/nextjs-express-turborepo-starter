'use client';

import { cn } from '@/lib/utils';
import React, { FC } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/Spinner';

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
