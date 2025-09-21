'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rubric } from '@/lib/types';

interface Props {
  rows: Rubric[];
  onDeleteRequest: (id: string) => void;
}

export default function RubricTable({ rows, onDeleteRequest }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Rows</TableHead>
          <TableHead>Template</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">
              <Link href={`/rubrics/${r.id}/edit`} className="hover:underline">
                {r.name}
              </Link>
            </TableCell>
            <TableCell>{r.subjectCode}</TableCell>
            <TableCell>{r.rowCount}</TableCell>
            <TableCell>
              {r.templateId ? `Yes (v${r.templateVersion ?? '?'})` : 'No'}
            </TableCell>
            <TableCell>{new Date(r.updatedAt).toLocaleDateString()}</TableCell>
            <TableCell>
              {r.status === 'update-available' && (
                <Badge>Update available</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex justify-start gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/rubrics/${r.id}/edit`}>Open</Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDeleteRequest(r.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
