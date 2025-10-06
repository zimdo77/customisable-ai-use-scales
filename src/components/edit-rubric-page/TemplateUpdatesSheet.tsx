'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rubric, RubricRow, RubricTemplate, TemplateRow } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '../ui/badge';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  rubric: Rubric;
  template: RubricTemplate;
  onApply: (nextRows: RubricRow[], newTemplateVersion: number) => void;
}

export default function TemplateUpdatesSheet({
  open,
  onOpenChange,
  rubric,
  template,
  onApply,
}: Props) {
  // map template rows by id
  const tmap = React.useMemo(
    () => new Map(template.rows.map((r) => [r.id, r])),
    [template.rows],
  );

  // figure out which linked rows differ
  const diffs = rubric.rows
    .map((r, idx) => {
      if (!r.templateRowId) return null;
      const t = tmap.get(r.templateRowId);
      if (!t) return null;
      const changed =
        r.task !== t.task ||
        r.aiUseLevel !== t.aiUseLevel ||
        r.instructions !== t.instructions ||
        r.examples !== t.examples ||
        r.acknowledgement !== t.acknowledgement;
      return { idx, r, t, changed };
    })
    .filter(Boolean) as {
    idx: number;
    r: RubricRow;
    t: TemplateRow;
    changed: boolean;
  }[];

  const [selected, setSelected] = React.useState(new Set<number>());

  React.useEffect(() => {
    // pre-select all rows that differ
    const s = new Set<number>();
    diffs.forEach((d) => {
      if (d.changed) s.add(d.idx);
    });
    setSelected(s);
  }, [open]);

  const toggle = (i: number, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(i);
    else next.delete(i);
    setSelected(next);
  };

  const apply = () => {
    const next = rubric.rows.slice();
    selected.forEach((i) => {
      const r = next[i];
      const t = tmap.get(r.templateRowId!);
      if (!t) return;
      next[i] = {
        ...r,
        task: t.task,
        aiUseLevel: t.aiUseLevel,
        instructions: t.instructions,
        examples: t.examples,
        acknowledgement: t.acknowledgement,
      };
    });
    onApply(next, template.version);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>Template updates</SheetTitle>
          <SheetDescription>
            Template <code>{template.id}</code> version:{' '}
            <span className="text-chart-5">v{template.version}</span>
            <br />
            Your rubric version:{' '}
            <span className="text-chart-5">
              v{rubric.templateVersion ?? '?'}
            </span>
            <br />
            Select rows to apply the newer template text.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-0 pr-4 overflow-y-auto">
          <div className="space-y-4">
            {diffs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No differences detected for linked rows.
              </p>
            )}
            {diffs.map(({ idx, r, t, changed }) => (
              <div key={r.id} className="rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selected.has(idx)}
                    onCheckedChange={(v) => toggle(idx, !!v)}
                    disabled={!changed}
                  />
                  <div className="text-sm font-medium">
                    Row {idx + 1}{' '}
                    {r.templateRowId ? (
                      <span className="text-muted-foreground">
                        · linked {r.templateRowId}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="font-semibold">Your rubric</div>
                    <Field name="Task" value={r.task} />
                    <Field name="AI Use Scale Level" value={r.aiUseLevel} />
                    <Field
                      name="Instructions to Students"
                      value={r.instructions}
                    />
                    <Field name="Examples" value={r.examples} />
                    <Field
                      name="AI Use Acknowlegement"
                      value={r.acknowledgement}
                    />
                  </div>
                  <div>
                    <div className="font-semibold">
                      Template v{template.version}
                    </div>
                    <Field name="Task" value={t.task} />
                    <Field name="AI Use Scale Level" value={t.aiUseLevel} />
                    <Field
                      name="Instructions to Students"
                      value={t.instructions}
                    />
                    <Field name="Examples" value={t.examples} />
                    <Field
                      name="AI Use Acknowlegement"
                      value={t.acknowledgement}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={apply} disabled={selected.size === 0}>
            Apply selected
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({ name, value }: { name: string; value: string }) {
  return (
    <div className="mt-1">
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className="rounded-lg border bg-muted/30 px-2 py-1 break-words whitespace-normal">
        {value || <span className="opacity-60">(empty)</span>}
      </div>
    </div>
  );
}
