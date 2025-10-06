'use client';

import { sampleRubrics } from '@/lib/mock';
import RubricsHomeClient from '@/components/my-rubrics-page/RubricsHomeClient';

export default function Page() {
  // server component; pass initial data to client
  return <RubricsHomeClient initialData={sampleRubrics} />;
}
