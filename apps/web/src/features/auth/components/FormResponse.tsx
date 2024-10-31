import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cva, VariantProps } from 'class-variance-authority';
import { Info, Terminal } from 'lucide-react';

const formResponseVariants = cva('', {
  variants: {
    variant: {
      success: '',
      destructive: '',
    },
  },
  defaultVariants: {
    variant: 'success',
  },
});

export interface FormResponseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formResponseVariants> {
  title: string;
  description: string;
}

const FormResponse = ({ title, description, className, variant, ...props }: FormResponseProps) => {
  return (
    <Alert variant={variant} className={className} {...props}>
      <Info className='size-4' />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default FormResponse;
