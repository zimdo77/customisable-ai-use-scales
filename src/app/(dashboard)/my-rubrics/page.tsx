// contains tiles to CUS Library and USL Library
'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

export default function MyRubricsPage() {
  const rubrics = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: 'Hover Card Title',
        description: 'Hover Card Description',
      })),
    [],
  );

  return (
    <div className="min-h-screen w-full bg-[#F3F6F9]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[44px] leading-none font-extrabold tracking-tight">
              My Rubrics
            </h1>
            <div className="text-lg text-muted-foreground mt-1">
              &lt;FolderName&gt;
            </div>
          </div>

          {/* Sort By | Value | X and New */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center bg-white rounded-full border shadow-sm overflow-hidden">
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Sort By
              </span>
              <span className="px-4 py-2 text-sm font-medium border-l">
                Value
              </span>
              <button
                className="px-3 py-2 border-l hover:bg-gray-50"
                aria-label="Clear sort"
                onClick={() => alert('Clear sort (placeholder)')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Button
              className="rounded-full px-5"
              onClick={() => alert('New rubric (placeholder)')}
            >
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
        </div>

        {/* Small "New +" under title */}
        <div className="mt-6">
          <Button
            variant="outline"
            className="rounded-full bg-white"
            onClick={() => alert('New rubric (left) placeholder')}
          >
            New +
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rubrics.map((r) => (
            <Card
              key={r.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-[15px] font-semibold">
                  {r.title}
                </CardTitle>
                <CardDescription className="mb-3">
                  {r.description}
                </CardDescription>
                <div className="h-20 rounded-md border-2 border-dashed border-gray-300" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
