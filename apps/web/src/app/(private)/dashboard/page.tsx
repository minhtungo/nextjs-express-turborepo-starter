import { assertAuthenticated } from "@/lib/auth";

const DashBoard = async () => {
  const user = await assertAuthenticated();

  return <div className="text-lg">{JSON.stringify(user)}</div>;
};

export default DashBoard;
