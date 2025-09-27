'use client';

import * as React from 'react';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import RubricsToolbar from './RubricsToolbar';
import RubricCard from './RubricCard';
import RubricTable from './RubricTable';
import CreateRubricModal, { CreateRubricPayload } from './CreateRubricModal';
import { sampleTemplates } from '@/lib/mock';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Rubric, RubricRow } from '@/lib/types';
import { toast } from 'sonner';

type SortKey = 'updated' | 'name' | 'subject';
type FilterKey = 'all' | 'mine' | 'shared' | 'updates';
type ViewKey = 'grid' | 'list';

interface Props {
  initialData: Rubric[];
}

export default function RubricsHomeClient({ initialData }: Props) {
  const [rubrics, setRubrics] = React.useState<Rubric[]>(initialData);
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<SortKey>('updated');
  const [filter, setFilter] = React.useState<FilterKey>('all');
  const [view, setView] = React.useState<ViewKey>('grid');
  const [loading, setLoading] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Rubric | null>(null);
  const lastDeletedRef = React.useRef<Rubric | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  // Simulate loading
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600); // fake shimmer time
    return () => clearTimeout(t);
  }, []);

  // Display filtered, searched, and sorted rubrics
  const filtered = React.useMemo(() => {
    let rows = [...rubrics];

    // filter
    rows = rows.filter((r) => {
      if (filter === 'updates') return r.status === 'update-available';
      if (filter === 'shared') return !!r.shared;
      if (filter === 'mine') return r.ownerId === 'me' && !r.shared;
      return true;
    });

    // search
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.subjectCode.toLowerCase().includes(q),
      );
    }

    // sort
    rows.sort((a, b) => {
      if (sort === 'updated') {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.subjectCode.localeCompare(b.subjectCode);
    });

    return rows;
  }, [rubrics, query, sort, filter]);

  // Duplicate rubric handler
  const handleDuplicate = (id: string) => {
    const src = rubrics.find((r) => r.id === id);
    if (!src) return;

    // deep copy rows with fresh IDs
    const rows = src.rows.map((row) => ({
      ...row,
      id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, // new unique id
      // keep templateRowId if it was linked, so updates still work
    }));

    const copy: Rubric = {
      ...src,
      id: `dup-${Date.now()}`,
      name: `${src.name} (copy)`,
      updatedAt: new Date().toISOString(),
      status: 'active',
      shared: false,
      rows,
      rowCount: rows.length,
    };

    setRubrics((prev) => [copy, ...prev]);
  };

  // Export rubric handler (JSON - change this to XLSX later)
  const handleExport = (id: string) => {
    const r = rubrics.find((x) => x.id === id);
    if (!r) return;
    const blob = new Blob([JSON.stringify(r, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${r.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Request delete: open confirmation dialog for rubric
  const requestDelete = (id: string) => {
    const item = rubrics.find((r) => r.id === id) || null;
    setDeleteTarget(item);
  };

  // Confirm delete: remove rubric from state
  const confirmDelete = () => {
    if (!deleteTarget) return;
    const deleted = deleteTarget;
    lastDeletedRef.current = deleted;
    setRubrics((prev) => prev.filter((r) => r.id !== deleted.id));
    setDeleteTarget(null);
    toast.success('Rubric deleted', {
      description: `"${deleted.name}" was removed.`,
    });
  };

  // Total rubrics count
  const totalCount = rubrics.length;

  // Create rubric handler
  const handleCreate = (payload: CreateRubricPayload) => {
    // purely frontend demo: add a new item locally
    const now = new Date().toISOString();

    if (payload.mode === 'scratch') {
      // from scratch
      const rows = Array.from({ length: payload.initialRows }, (_, i) =>
        makeBlankRow(i),
      );
      const newItem: Rubric = {
        id: `rb-${Date.now()}`,
        name: payload.name,
        subjectCode: payload.subjectCode,
        rowCount: payload.initialRows,
        version: 1,
        updatedAt: now,
        status: 'active',
        ownerId: 'me',
        shared: false,
        rows,
      };
      setRubrics((prev) => [newItem, ...prev]);
      toast.success('Rubric created', { description: `Started from scratch` });
      return;
    }

    if (payload.mode === 'template') {
      // from template
      const tpl = sampleTemplates.find((t) => t.id === payload.templateId);
      const rows = tpl
        ? tpl.rows.map((tr) => ({
            id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            templateRowId: payload.linkForUpdates ? tr.id : undefined,
            task: tr.task,
            aiUseLevel: tr.aiUseLevel,
            instructions: tr.instructions,
            examples: tr.examples,
            acknowledgement: tr.acknowledgement,
          }))
        : [];

      const newItem: Rubric = {
        id: `rb-${Date.now()}`,
        name: payload.name,
        subjectCode: payload.subjectCode,
        rowCount:
          sampleTemplates.find((t) => t.id === payload.templateId)?.rowCount ??
          10,
        version: 1,
        templateId: payload.templateId,
        templateVersion: sampleTemplates.find(
          (t) => t.id === payload.templateId,
        )?.version,
        updatedAt: now,
        status: 'active',
        ownerId: 'me',
        shared: false,
        rows,
      };
      setRubrics((prev) => [newItem, ...prev]);
      toast.success('Rubric created', {
        description: payload.linkForUpdates
          ? 'Linked to template for future updates.'
          : 'Copied from template (not linked).',
      });
    }
  };

  const makeBlankRow = (index: number): RubricRow => ({
    id: `row-${Date.now()}-${index}`,
    task: '',
    aiUseLevel: '',
    instructions: '',
    examples: '',
    acknowledgement: '',
  });

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-10 bg-background px-10 py-3">
        <h1 className="text-[44px] font-semibold tracking-tight">My Rubrics</h1>
        <p className="text-m text-muted-foreground">
          Create, search, and manage your rubrics.
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-col pt-33 px-10 gap-8">
        {/* Toolbar for search, filter, sort, view, and create */}
        <RubricsToolbar
          query={query}
          onQuery={setQuery}
          sort={sort}
          onSort={setSort}
          filter={filter}
          onFilter={setFilter}
          view={view}
          onView={setView}
          totalCount={totalCount}
          onCreateRubric={() => setCreateOpen(true)}
        />

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-60 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state: no rubrics match filters */}
        {!loading && filtered.length === 0 && (
          <div className="border rounded-2xl p-10 text-center">
            <h3 className="text-lg font-medium">
              No rubrics match your filters
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting search or create a new rubric from scratch or a
              template.
            </p>
            <Button className="mt-4" onClick={() => setCreateOpen(true)}>
              Create rubric
            </Button>
          </div>
        )}

        {/* Data: grid or table view */}
        {!loading &&
          filtered.length > 0 &&
          (view === 'grid' ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r) => (
                <RubricCard
                  key={r.id}
                  item={r}
                  onDuplicate={handleDuplicate}
                  onExport={handleExport}
                  onDeleteRequest={requestDelete}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border">
              <RubricTable rows={filtered} onDeleteRequest={requestDelete} />
            </div>
          ))}

        {/* Confirm Delete Dialog */}
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onOpenChange={(v) => !v && setDeleteTarget(null)}
          itemName={deleteTarget?.name}
          onConfirm={confirmDelete}
        />

        {/* Create Rubric Modal */}
        <CreateRubricModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          templates={sampleTemplates}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}
