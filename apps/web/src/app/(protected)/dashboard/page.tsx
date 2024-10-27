import { authRoutes } from '@/config';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const DashBoard = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authRoutes.signIn);
  }

  return <div>{user.email}</div>;
};

export default DashBoard;
