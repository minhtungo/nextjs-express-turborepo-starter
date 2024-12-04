import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../../../../../../packages/ui/src/button';
import { VariantProps } from 'class-variance-authority';

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

export default BackButton;
