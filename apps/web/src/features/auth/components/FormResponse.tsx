import { cva, VariantProps } from 'class-variance-authority';
import { CheckCircle, MessageCircleWarning } from 'lucide-react';

const formResponseVariants = cva('flex items-center justify-center text-sm', {
  variants: {
    variant: {
      success: 'bg-success text-success-foreground',
      error: 'text-red-500 dark:text-red-400',
    },
  },
});

export interface FormResponseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formResponseVariants> {
  message: string;
}

const FormResponse = ({ message, className, variant, ...props }: FormResponseProps) => {
  return (
    <div className={formResponseVariants({ variant, className })} {...props}>
      {variant === 'success' ? <CheckCircle className='size-5' /> : <MessageCircleWarning className='size-5' />}
      {message}
    </div>
  );
};

export default FormResponse;
