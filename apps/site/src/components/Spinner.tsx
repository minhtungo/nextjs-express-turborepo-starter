import { cn } from '@/lib/utils';
import { FC } from 'react';

interface SpinnerProps {
  className?: string;
}

const Spinner: FC<SpinnerProps> = ({ className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        'text-brand inline-block size-4 animate-spin rounded-full border-[2px] border-current border-t-transparent',
        className
      )}
      role='status'
      aria-label='loading'
    />
  );
};

export default Spinner;
