'use server';

export const signInWithProvider = async (
  provider: 'google' | 'facebook',
  {
    redirectTo,
  }: {
    redirectTo: string;
  }
) => {};

export const signInWithPassword = async () => {};
