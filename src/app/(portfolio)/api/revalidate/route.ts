import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import crypto from 'crypto';

/**
 * GitHub webhook endpoint — call this from your GitHub repo's webhook settings:
 *   Payload URL: https://your-domain.com/api/revalidate
 *   Content type: application/json
 *   Secret: set REVALIDATE_SECRET in your env vars and match it in GitHub
 *   Events: "Just the push event"
 *
 * On every push to the portfolio-data.json repo, this will bust the cache
 * and Next.js will re-fetch the data from GitHub on the next page request.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  // If a secret is configured, verify the GitHub webhook signature
  if (secret) {
    const signature = req.headers.get('x-hub-signature-256');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const body = await req.text();
    const expected = `sha256=${crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')}`;

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  // Bust all pages that depend on portfolio data
  // @ts-expect-error - Next.js 15+ revalidateTag profile arg
  revalidateTag('portfolio-data');

  console.log('[Revalidate] Cache busted via GitHub webhook push');
  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() });
}

// Also allow manual GET revalidation with a secret token (useful for testing)
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // @ts-expect-error - Next.js 15+ revalidateTag profile arg
  revalidateTag('portfolio-data');
  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() });
}
