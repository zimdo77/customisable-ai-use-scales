import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/app/utils/supabase/server';

// Validate input for request body
const Body = z.object({
  acceptRowIds: z.array(z.string().uuid()).min(1), // array of row IDs to accept updates for
});

// POST handler for applying template updates
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const sb = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Parse and validate the request body
  const { acceptRowIds } = Body.parse(await req.json());

  // Call the Postgres RPC function to apply template updates to the rubric
  const { data, error } = await sb.rpc('apply_template_updates', {
    p_rubric_id: params.id, // rubric ID from the URL
    p_accept: acceptRowIds, // array of row IDs to accept updates for
  });

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json(data);
}
