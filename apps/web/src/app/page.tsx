import { authRoutes } from '@/config';
import Link from 'next/link';

export default function Home() {
  return (
    <div className=''>
      <Link href={authRoutes.signIn}>Sign In</Link>
    </div>
  );
}
