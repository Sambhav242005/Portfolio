'use server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { generateRandomPassword } from '@/lib/password/password';

export async function GET(){

  generateRandomPassword();

  return new Response('Password Generated')
}


export async function POST(request: Request) {
  const { password } = await request.json()
  const storedHash = (await cookies()).get('auth')?.value

  if (!storedHash) {
    return NextResponse.json({ error: 'No password set' }, { status: 400 })
  }

  const inputHash = crypto.createHash('sha256').update(password).digest('hex')

  if (inputHash === storedHash) {
    (await cookies()).set('loggedIn', 'true', { httpOnly: true, secure: true })
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
}