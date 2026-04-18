import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";

export async function GET(req: NextRequest) {
  // Check auth
  const auth = req.cookies.get("loggedIn");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = req.cookies.get("loggedIn");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Data mutations via Dashboard are forcefully bypassed since data relies on github now.
  // We simply mirror success back so the UI doesn't crash if clicked.
  return NextResponse.json({ success: true, message: "Read-only mode. Use GitHub to update." });
}
