'use client';

import * as React from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { RubricTemplate } from '@/lib/types';

interface Props {
  templates: RubricTemplate[];
  value?: string | null;
  onChange: (templateId: string | null) => void;
  placeholder?: string;
}

export default function TemplateCombobox({
  templates,
  value,
  onChange,
  placeholder = 'Select a template...',
}: Props) {
  const [open, setOpen] = React.useState(false);

  // Find currently selected template
  const selected = templates.find((t) => t.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate overflow-hidden whitespace-nowrap max-w-[450px]">
            {selected
              ? `${selected.name} · ${selected.subjectCode} (v${selected.version})`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command
          filter={(v, s) => (v.toLowerCase().includes(s.toLowerCase()) ? 1 : 0)}
        >
          <CommandInput placeholder="Search templates..." />
          <CommandEmpty>No templates found.</CommandEmpty>
          <CommandGroup>
            {templates.map((t) => (
              <CommandItem
                key={t.id}
                value={`${t.name} ${t.subjectCode}`}
                onSelect={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
                className="flex items-start gap-2"
              >
                <Check
                  className={cn(
                    'h-4 w-4 mt-0.5',
                    value === t.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium ">{t.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.subjectCode} • v{t.version} • {t.rowCount} rows
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
