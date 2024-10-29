import { createHash } from "node:crypto";
import crypto from "node:crypto";

export const generateRandomToken = async (length = 32) => {
  const buf = await new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });

  return buf.toString("hex").slice(0, length);
};

export const hashToken = (token: string, secret: string) => {
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
};

export const verifyToken = (plainToken: string, hashedToken: string, secret: string) => {
  const hashedPlainToken = hashToken(plainToken, secret);
  return hashedPlainToken === hashedToken;
};
