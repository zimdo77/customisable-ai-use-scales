// Excel export for a CUS
// Filler

export const dynamic = "force-static"
export async function generateStaticParams() {
  return [{}];
}

import { NextRequest, NextResponse } from 'next/server';