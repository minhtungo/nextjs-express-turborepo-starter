import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';

interface AuthFormWrapperProps {
  children?: ReactNode;
  title: string;
  description?: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  className?: string;
  noBorderMobile?: boolean;
}

const AuthFormWrapper = ({
  children,
  title,
  backButtonHref,
  backButtonLabel,
  description,
  className,
}: AuthFormWrapperProps) => {
  return (
    <Card className='mx-auto w-full max-w-[500px]'>
      <CardHeader className='items-center'>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn(className)}>
        {children}
        {backButtonHref && backButtonLabel && (
          <BackButton className='mt-2.5' href={backButtonHref} label={backButtonLabel} variant='outline' />
        )}
      </CardContent>
    </Card>
  );
};

interface BackButtonProps extends VariantProps<typeof buttonVariants> {
  href: string;
  label: string;
  className: string;
}

const BackButton = ({ variant, size, className, href, label }: BackButtonProps) => {
  return (
    <Link className={cn(buttonVariants({ variant, size, className }), 'w-full')} href={href}>
      {label}
    </Link>
  );
};

export default AuthFormWrapper;
