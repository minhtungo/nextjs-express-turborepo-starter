'use client';

import { useUser } from '@/lib/auth';

const Dashboard = () => {
  const { data: user } = useUser();
  return <div>{JSON.stringify(user, null, 2)}</div>;
};

export default Dashboard;
