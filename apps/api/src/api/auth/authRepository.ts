import type { SignIn, SignUp } from '@/api/auth/authModel';
import { applicationName } from '@/common/utils/config';
import { sendEmail } from '@/common/utils/mail';
import { createUser, getUserByEmail } from '@/data-access/users';
import { createVerificationToken } from '@/data-access/verificationToken';
import { db } from '@/db';
import { type InsertUser, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export class AuthRepository {
  async signUp({ name, email, password }: SignUp): Promise<any> {
    const user = await createUser({
      email,
      password,
      name,
    });

    const token = await createVerificationToken(user.id);

    await sendEmail(email, `Verify your email for ${applicationName}`, token);

    return {
      id: user.id,
    };
  }

  async login({ email, password }: SignIn): Promise<any> {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // const isPasswordCorrect = await (email, password);

    // if (!isPasswordCorrect) {
    //   throw new Error("Invalid credentials");
    // }

    return {
      id: user.id,
    };
  }

  async getVerifyEmailToken(token: string): Promise<any> {
    // const existingToken = await db.query.verifyEmailTokens.findFirst({
    //   where: eq(verifyEmailTokens.token, token),
    // });
    // return existingToken;
  }

  async updateUser(userId: string, updatedUser: Partial<InsertUser>): Promise<any> {
    return db.update(users).set(updatedUser).where(eq(users.id, userId));
  }

  async deleteVerifyEmailToken(token: string) {
    return await db.delete(verifyEmailTokens).where(eq(verifyEmailTokens.token, token));
  }
}
