import type { User } from '@repo/database/schema/users';
import type { SessionUser } from '@repo/validation/user';

export const createSessionUserDTO = (user: User): SessionUser => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  };
};
