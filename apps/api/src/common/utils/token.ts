import crypto from "node:crypto";

export const generateToken = async (length = 32): Promise<string> => {
  // Use crypto.randomBytes for cryptographically strong random values
  const buffer = await crypto.randomBytes(Math.ceil(length * 0.75)); // Adjust for base64 encoding

  // Use URL-safe base64 encoding (better for URLs and emails)
  return buffer.toString("base64url").slice(0, length);
};

export const hashToken = (token: string, secret: string) => {
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
};

export const verifyToken = (plainToken: string, hashedToken: string, secret: string) => {
  const hashedPlainToken = hashToken(plainToken, secret);
  return hashedPlainToken === hashedToken;
};
