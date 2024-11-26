import { db } from '@repo/database';

export async function createTransaction<T extends typeof db>(cb: (trx: T) => void) {
  await db.transaction(cb as any);
}
