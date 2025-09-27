'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Copy, Download, Trash } from 'lucide-react';
import { Rubric } from '@/lib/types';
import Link from 'next/link';

interface Props {
  item: Rubric;
  onDuplicate: (id: string) => void;
  onExport: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}

export default function RubricCard({
  item,
  onDuplicate,
  onExport,
  onDeleteRequest,
}: Props) {
  const statusBadge =
    item.status === 'update-available' ? (
      <Badge className="animate-pulse">Template update available</Badge>
    ) : null;

  return (
    <Card className="flex flex-col min-w-[300px] min-h-[200px] hover:cursor-pointer hover:bg-muted">
      <Link
        className="flex flex-col flex-grow"
        href={`/edit-rubric/${item.id}`}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">{item.name}</CardTitle>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{item.subjectCode}</span>
              <span>•</span>
              <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{item.rowCount} rows</span>
            </div>
            <div className="mt-2 flex gap-2">{statusBadge}</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/rubrics/${item.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(item.id)}>
                <Copy className="mr-2 h-4 w-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport(item.id)}>
                <Download className="mr-2 h-4 w-4" /> Export (.json)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDeleteRequest(item.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground mt-auto">
          {item.templateId ? (
            <p>
              Derived from template{' '}
              <span className="font-mono">{item.templateId}</span> (v
              {item.templateVersion ?? '?'})
            </p>
          ) : (
            <p>Created from scratch</p>
          )}
        </CardContent>
        {/* <CardFooter className="mt-auto">
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/rubrics/${item.id}/edit`}>Open</Link>
          </Button>
        </CardFooter> */}
      </Link>
    </Card>
  );
}
