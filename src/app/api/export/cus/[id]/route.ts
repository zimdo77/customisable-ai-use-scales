// Excel export for a CUS
// Filler

export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello World" });
}