import "server-only";
import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
const options = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
function scrypt(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => nodeScrypt(password, salt, 64, options, (error, key) => error ? reject(error) : resolve(key)));
}
export const passwordHashPattern = /^scrypt[:$][a-f0-9]{32}[:$][a-f0-9]{128}$/;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt);
  // Colons avoid dotenv variable expansion of dollar signs.
  return `scrypt:${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  if (!passwordHashPattern.test(encoded) || password.length > 256) return false;
  const [, salt, expected] = encoded.split(/[:$]/);
  const actual = await scrypt(password, salt!);
  return timingSafeEqual(actual, Buffer.from(expected!, "hex"));
}
