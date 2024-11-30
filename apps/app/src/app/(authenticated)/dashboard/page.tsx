import { authRoutes } from '@/config';
import { getUserInfoService } from '@/features/user/lib/services';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const DashBoard = async () => {
  const session = await getSession();

  const user = session?.user;

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
