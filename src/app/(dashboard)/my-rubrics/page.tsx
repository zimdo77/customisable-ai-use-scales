// contains tiles to CUS Library and USL Library
'use client';

import { sampleRubrics } from '@/lib/mock';
import RubricsHomeClient from '@/components/MyRubrics';

export default function Page() {
  // server component; pass initial data to client
  return <RubricsHomeClient initialData={sampleRubrics} />;
}