import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  // Check auth
  const auth = req.cookies.get("loggedIn");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getAnalyticsSummary();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read analytics" }, { status: 500 });
  }
}
