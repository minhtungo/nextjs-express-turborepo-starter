import crypto from 'crypto';

export const generateRandomToken = async (length: number = 32) => {
  const buf = await new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });

  return buf.toString('hex').slice(0, length);
};
