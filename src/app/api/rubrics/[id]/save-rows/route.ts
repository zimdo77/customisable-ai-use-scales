import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/app/utils/supabase/server';

// Validate input for a rubric row
const Row = z.object({
  id: z.string().uuid().optional(), // present for existing rows
  position: z.number().int().min(0),
  templateRowId: z.string().uuid().nullable().optional(),
  task: z.string(),
  aiUseLevel: z.string(),
  instructions: z.string(),
  examples: z.string(),
  acknowledgement: z.string(),
});

// Validate input for the request body
const Body = z.object({
  rows: z.array(Row).min(1),
  bumpVersion: z.boolean().default(true),
});

// PATCH handler for saving rubric rows
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const sb = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Parse and validate the request body
  const { rows, bumpVersion } = Body.parse(await req.json());

  // Call the Postgres RPC function to save rubric rows
  const { data, error } = await sb.rpc('save_rubric_rows', {
    p_rubric_id: params.id,
    p_rows: rows.map((r) => ({
      id: r.id ?? null,
      position: r.position,
      templateRowId: r.templateRowId ?? null,
      task: r.task,
      aiUseLevel: r.aiUseLevel,
      instructions: r.instructions,
      examples: r.examples,
      acknowledgement: r.acknowledgement,
    })),
    p_bump: bumpVersion,
  });

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json(data);
}
