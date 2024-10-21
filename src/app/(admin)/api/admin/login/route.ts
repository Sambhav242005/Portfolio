'use server'

import { cookies } from 'next/headers';
import { generateRandomPassword, verifyPassword } from '@/lib/password/password';

export async function GET(){

  generateRandomPassword();

  return new Response('Password Generated')
}


export async function POST(request: Request) {
  const body = await request.json(); 
  const { password } = body;

  const isValid = await verifyPassword(password);

  if (!isValid) {
    return new Response('Invalid password', { status: 401 });
  }

  cookies().set('auth', 'true');

  return new Response('Login successful');
}
