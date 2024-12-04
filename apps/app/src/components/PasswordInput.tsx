import { Input, InputProps } from '../../../../packages/ui/src/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const PasswordInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='relative w-full'>
      <Input className='pr-12' {...props} type={showPassword ? 'text' : 'password'} />
      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='absolute right-0 top-1/2 mr-3 -translate-y-1/2 text-muted-foreground outline-none transition-all duration-150 focus:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        arial-label='Show password'
      >
        {showPassword ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}
      </button>
    </div>
  );
};

export default PasswordInput;
