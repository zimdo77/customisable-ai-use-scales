"use server";

// Excel export for a CUS
// Filler

export const dynamic = "force-static"

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello World' });
}