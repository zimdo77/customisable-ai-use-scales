import { notFound } from 'next/navigation';
import RubricEditorClient from '@/components/edit-rubric-page/RubricEditorClient';
import { getRubricById, getTemplateById } from '@/lib/mock';

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const rubric = await getRubricById(params.id);
  if (!rubric) return notFound();

  const template = rubric.templateId
    ? await getTemplateById(rubric.templateId)
    : null;

  return (
    <RubricEditorClient initialRubric={rubric} linkedTemplate={template} />
  );
}
