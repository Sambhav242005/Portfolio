'use server'
// utils/password.ts
import { cookies } from 'next/headers'
import crypto from 'crypto';

let randomPassword: string | null = null;

export async function generateRandomPassword() {
  const password = crypto.randomBytes(8).toString('hex')
  randomPassword = password;
  console.log(`Generated password: ${password}`)
  
  // Store the hashed password in a server-side cookie
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
  ;(await cookies()).set('auth', hashedPassword, { httpOnly: true, secure: true })

  return await password
}

export async function verifyPassword(inputPassword: string) {

  console.log(inputPassword,randomPassword,inputPassword === randomPassword);
  

  return inputPassword === randomPassword;
}
