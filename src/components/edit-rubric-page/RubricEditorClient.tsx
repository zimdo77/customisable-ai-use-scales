'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Rubric, RubricTemplate, RubricRow } from '@/lib/types';
import EditRubricTable from './EditRubricTable';
import TemplateUpdatesSheet from './TemplateUpdatesSheet';
import { Separator } from '@/components/ui/separator';

interface Props {
  initialRubric: Rubric;
  linkedTemplate: RubricTemplate | null;
}

export default function RubricEditorClient({
  initialRubric,
  linkedTemplate,
}: Props) {
  const router = useRouter();

  const [rubric, setRubric] = React.useState<Rubric>(initialRubric);
  const [dirty, setDirty] = React.useState(false);
  const [updatesOpen, setUpdatesOpen] = React.useState(false);

  // unsaved-changes guard on hard navigation/refresh
  React.useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () =>
      window.removeEventListener('beforeunload', onBeforeunload as any);
    // NB: TS happy cast below:
    function onBeforeunload(e: BeforeUnloadEvent) {}
  }, [dirty]);

  // keyboard shortcuts: Cmd/Ctrl+S to save, Cmd/Ctrl+Enter add row
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rubric]);

  // header field handlers
  const setName = (name: string) => {
    setDirty(true);
    setRubric((r) => ({ ...r, name }));
  };
  const setSubject = (subjectCode: string) => {
    setDirty(true);
    setRubric((r) => ({ ...r, subjectCode }));
  };

  // rows handlers
  const onRowsChange = (rows: RubricRow[]) => {
    setDirty(true);
    setRubric((r) => ({ ...r, rows, rowCount: rows.length }));
  };

  // save/cancel (frontend only)
  const handleSave = () => {
    const now = new Date().toISOString();
    setRubric((r) => ({ ...r, updatedAt: now, version: r.version + 1 }));
    setDirty(false);
    toast('Saved', { description: 'Rubric changes have been saved (demo).' });
  };
  const handleCancel = () => {
    setRubric(initialRubric);
    setDirty(false);
    toast('Discarded', { description: 'Reverted to last loaded state.' });
  };

  const hasTemplateUpdates =
    rubric.status === 'update-available' &&
    linkedTemplate &&
    linkedTemplate.version > (rubric.templateVersion ?? 0);

  return (
    <div className="space-y-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
        <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center gap-3">
          <Input
            className="text-xl font-semibold h-10"
            value={rubric.name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="w-40"
            value={rubric.subjectCode}
            onChange={(e) => setSubject(e.target.value.toUpperCase())}
          />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex mx-auto text-sm max-w-screen-xl px-5 text-muted-foreground">
        <div className="flex items-center gap-5">
          <div className="flex flex-row gap-2">
            <Badge variant="outline">Rubric ID</Badge>
            <code>{rubric.id}</code>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex flex-row gap-2">
            <Badge variant="outline">Template</Badge>
            {rubric.templateId ? (
              <span>
                <code>{rubric.templateId}</code> (rubric on v
                {rubric.templateVersion ?? '?'}
                {linkedTemplate ? ` • template v${linkedTemplate.version}` : ''}
                )
              </span>
            ) : (
              <span className="">N/A</span>
            )}
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex flex-row gap-2">
            <Badge variant="outline">Rows</Badge>
            <span>{rubric.rowCount}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex flex-row gap-2">
            <Badge variant="outline">Version</Badge>
            <span>v{rubric.version}</span>
          </div>
        </div>
        {hasTemplateUpdates && (
          <Badge
            variant="default"
            onClick={() => setUpdatesOpen(true)}
            className="ml-auto animate-pulse"
          >
            Template updates available. Click to update.
          </Badge>
        )}
      </div>

      {/* Rows table */}
      <div className="mx-auto max-w-screen-xl px-4">
        <EditRubricTable
          rows={rubric.rows}
          onChange={onRowsChange}
          templateRows={linkedTemplate?.rows ?? []}
          dirty={dirty}
        />
      </div>

      {/* Template updates side sheet */}
      {hasTemplateUpdates && linkedTemplate && (
        <TemplateUpdatesSheet
          open={updatesOpen}
          onOpenChange={setUpdatesOpen}
          rubric={rubric}
          template={linkedTemplate}
          onApply={(nextRows, newTemplateVersion) => {
            setDirty(true);
            setRubric((r) => ({
              ...r,
              rows: nextRows,
              rowCount: nextRows.length,
              templateVersion: newTemplateVersion,
              status: 'active',
            }));
            setUpdatesOpen(false);
            toast('Updates applied', {
              description: 'Template changes merged.',
            });
          }}
        />
      )}
    </div>
  );
}
