'use client';

import * as React from 'react';
import Link from 'next/link';
import ConfirmDeleteDialog from './confirm-delete-dialog';
import RubricsToolbar from './rubrics-toolbar';
import RubricCard from './rubric-card';
import RubricTable from './rubric-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Rubric } from '@/lib/types';

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

  // Simulate loading
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600); // fake shimmer time
    return () => clearTimeout(t);
  }, []);

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

  // Actions (frontend only)
  const handleDuplicate = (id: string) => {
    const src = rubrics.find((r) => r.id === id);
    if (!src) return;
    const copy: Rubric = {
      ...src,
      id: `dup-${Date.now()}`,
      name: `${src.name} (copy)`,
      updatedAt: new Date().toISOString(),
      status: 'active',
      shared: false,
    };
    setRubrics((prev) => [copy, ...prev]);
  };

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

  const requestDelete = (id: string) => {
    const item = rubrics.find((r) => r.id === id) || null;
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const deleted = deleteTarget;
    lastDeletedRef.current = deleted;
    setRubrics((prev) => prev.filter((r) => r.id !== deleted.id));
    setDeleteTarget(null);
  };

  const totalCount = rubrics.length;

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
        />

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-60 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="border rounded-2xl p-10 text-center">
            <h3 className="text-lg font-medium">
              No rubrics match your filters
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting search or create a new rubric from scratch or a
              template.
            </p>
            <Button asChild className="mt-4">
              {/* Implement modal here */}
              <Link href="/rubrics/new">Create rubric</Link>
            </Button>
          </div>
        )}

        {/* Data */}
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
        {/* Confirm Delete */}
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onOpenChange={(v) => !v && setDeleteTarget(null)}
          itemName={deleteTarget?.name}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
