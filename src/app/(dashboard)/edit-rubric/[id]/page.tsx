import { notFound } from 'next/navigation';
import RubricEditorClient from '@/components/edit-rubric-page/RubricEditorClient';
import { getRubricById, getTemplateById } from '@/lib/mock';

interface Params {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  const rubric = await getRubricById(id);
  if (!rubric) return notFound();

  const template = rubric.templateId
    ? await getTemplateById(rubric.templateId)
    : null;

  return (
    <RubricEditorClient initialRubric={rubric} linkedTemplate={template} />
  );
}
