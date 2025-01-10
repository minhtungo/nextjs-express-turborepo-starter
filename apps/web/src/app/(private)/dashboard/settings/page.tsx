import ChangeUserPasswordForm from '@/features/user/components/ChangePasswordForm';
import UpdateProfileForm from '@/features/user/components/UpdateProfileForm';

const SettingsPage = async () => {
  return (
    <div className="space-y-8">
      <UpdateProfileForm />
      <ChangeUserPasswordForm />
    </div>
  );
};

export default SettingsPage;
