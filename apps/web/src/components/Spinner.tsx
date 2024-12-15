import { cn } from '@/lib/utils';
import { Loader2Icon } from '@repo/ui/icons';
import { FC } from 'react';

interface SpinnerProps {
  className?: string;
}

const Spinner: FC<SpinnerProps> = ({ className }: SpinnerProps) => {
  return <Loader2Icon className={cn('animate-spin w-4 h-4', className)} />;
};

export default Spinner;
