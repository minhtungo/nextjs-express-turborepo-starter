import { assertAuthenticated } from '@/lib/auth';

const DashBoard = async () => {
  const user = await assertAuthenticated();

  return (
    <div>
      <h1>Hello: {user.name}</h1>
    </div>
  );
};

export default DashBoard;
