import ChangeUserPasswordForm from '@/features/user/components/ChangePasswordForm';
import UpdateUserForm from '@/features/user/components/UpdateUserForm';

const SettingsPage = async () => {
  return (
    <div className="space-y-8">
      <UpdateUserForm />
      <ChangeUserPasswordForm />
    </div>
  );
};

export default SettingsPage;
