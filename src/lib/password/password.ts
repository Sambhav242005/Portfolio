'use server';
import crypto from 'crypto';
import { Resend } from 'resend';

// Server-memory OTP store — persists across requests within the same server process.
// On Vercel/serverless, this resets per cold start — acceptable for a personal portfolio.
interface OtpStore {
  hash: string;        // SHA-256 hash of the OTP
  expiresAt: number;   // Unix ms timestamp
  attempts: number;    // Failed attempt counter
}

let otpStore: OtpStore | null = null;

const OTP_TTL_MS = 10 * 60 * 1000;  // 10 minutes
const MAX_ATTEMPTS = 5;

export async function generateOtp(): Promise<string> {
  const otp = crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g. "A3F1B2C4"
  const hash = crypto.createHash('sha256').update(otp).digest('hex');

  otpStore = {
    hash,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  };

  // Always log to console (visible in server terminal)
  console.log('\n========================================');
  console.log(`  🔑 ADMIN OTP: ${otp}`);
  console.log(`  ⏰ Expires in: 10 minutes`);
  console.log('========================================\n');

  // Also send via email if Resend is configured
  try {
    const adminEmail = process.env.email || process.env.ADMIN_EMAIL;
    if (process.env.RESEND_API_KEY && adminEmail) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Portfolio Admin <onboarding@resend.dev>',
        to: adminEmail,
        subject: '🔐 Your Admin Login OTP',
        text: `Your one-time admin password is:\n\n  ${otp}\n\nExpires in 10 minutes. Do not share this.`,
        html: `
          <div style="font-family:monospace;padding:24px;background:#111;color:#fff;border-radius:8px;max-width:400px">
            <h2 style="margin:0 0 16px;color:#a78bfa">Portfolio Admin Login</h2>
            <p style="color:#9ca3af;margin:0 0 8px">Your one-time password:</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:0.2em;color:#fff;background:#1f1f1f;padding:16px;border-radius:6px;text-align:center">${otp}</div>
            <p style="color:#6b7280;margin:16px 0 0;font-size:12px">Expires in 10 minutes. Do not share this.</p>
          </div>
        `,
      });
      console.log(`[OTP] Email sent to ${adminEmail}`);
    }
  } catch (err) {
    console.warn('[OTP] Email send failed (OTP still valid in console):', err);
  }

  return otp;
}

export async function verifyOtp(input: string): Promise<{ success: boolean; error?: string }> {
  if (!otpStore) {
    return { success: false, error: 'No OTP generated. Visit the login page to generate one.' };
  }

  if (Date.now() > otpStore.expiresAt) {
    otpStore = null;
    return { success: false, error: 'OTP expired. Refresh the login page to get a new one.' };
  }

  if (otpStore.attempts >= MAX_ATTEMPTS) {
    otpStore = null;
    return { success: false, error: 'Too many attempts. Refresh the login page to get a new OTP.' };
  }

  const inputHash = crypto.createHash('sha256').update(input.toUpperCase()).digest('hex');

  if (inputHash === otpStore.hash) {
    otpStore = null; // Invalidate after successful use
    return { success: true };
  }

  otpStore.attempts += 1;
  const remaining = MAX_ATTEMPTS - otpStore.attempts;
  return { success: false, error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` };
}
