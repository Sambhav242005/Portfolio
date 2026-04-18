import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateOtp, verifyOtp } from '@/lib/password/password';

// GET /api/admin/login — generates and sends a new OTP
export async function GET() {
  try {
    await generateOtp();
    return NextResponse.json({ ok: true, message: 'OTP generated. Check your email or server console.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/login — verifies the OTP and sets the session cookie
export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const result = await verifyOtp(password);

  if (result.success) {
    (await cookies()).set('loggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8-hour session
      path: '/',
    });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
}