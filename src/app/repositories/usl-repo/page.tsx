// USL repository browser

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type RepoItem = {
  id: number;
  title: string;
  description?: string;
};

export default function UseScaleRepositoryPage() {
  const router = useRouter();

  // static items for now (swap with API later)
  const items: RepoItem[] = useMemo(
    () => [
      { id: 1, title: "FolderName", description: "" },
      { id: 2, title: "FolderName", description: "Hover Card Description" },
      { id: 3, title: "UseScale Version1.1", description: "" },
    ],
    []
  );

  return (
    <div className="min-h-screen w-full bg-[#F3F6F9]">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-10">
        {/* Top bar: back (left) + centered title */}
        <div className="relative mb-6">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-1 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-3xl md:text-4xl font-extrabold text-center">
            Use Scale Repository
          </h1>
        </div>

        {/* Back a folder link (left) */}
        <div className="mb-6">
          <button
            onClick={() => alert('Go back a folder (placeholder)')}
            className="inline-flex items-center gap-2 text-base font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back A Folder
          </button>
        </div>

        {/* Cards grid (3 across like the mock) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it) => (
            <Card
              key={it.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-6">
                <CardTitle className="text-[15px] font-semibold">{it.title}</CardTitle>
                {it.description ? (
                  <CardDescription className="mb-3">{it.description}</CardDescription>
                ) : (
                  <div className="h-3" />
                )}

                {/* dashed placeholder box */}
                <div className="h-24 rounded-md border-2 border-dashed border-gray-300" />
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Bottom path label */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          PATH FEIT/comp1001/
        </div>
      </div>
    </div>
  );
}