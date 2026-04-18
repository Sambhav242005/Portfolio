import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await recordPageView(body.path, body.userAgent, body.ip);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}
