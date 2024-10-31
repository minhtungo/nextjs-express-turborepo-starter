import { authRoutes } from '@/config';
import { getUserInfoService } from '@/features/user/lib/services';
import { getCurrentUser } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const DashBoard = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authRoutes.signIn);
  }

  const data = await getUserInfoService();

  return (
    <div>
      {user.email}
      <h3>Response: {JSON.stringify(data)}</h3>
    </div>
  );
};

export default DashBoard;
