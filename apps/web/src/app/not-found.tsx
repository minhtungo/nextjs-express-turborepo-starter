import { buttonVariants } from '@repo/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link className={buttonVariants({ variant: 'outline' })} href="/">
        Go Home
      </Link>
    </div>
  );
}
