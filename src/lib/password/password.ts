// utils/password.ts
import crypto from 'crypto';

let randomPassword: string | null = null;

export function generateRandomPassword() {
  if (!randomPassword) {
    randomPassword = crypto.randomBytes(4).toString('hex'); // Generate a random password (8 characters)
    console.log(`Generated random password: ${randomPassword}`);
  }
  return randomPassword;
}

export function verifyPassword(inputPassword: string) {
  return inputPassword === randomPassword;
}
