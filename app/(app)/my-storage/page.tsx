"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FolderOpen, Lock } from "lucide-react";
import { useRole } from "@/components/providers/role-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { FileIcon, KIND_LABEL } from "@/components/shared/file-icon";
import { PageHeader } from "@/components/shared/page-header";
import { CardGridSkeleton, HeaderSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import { QuotaRing } from "@/components/storage/quota-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulatedLoading } from "@/lib/hooks";
import { filesByOwner } from "@/lib/mock/files";
import { formatDate, formatGB, formatSize, percent } from "@/lib/utils";

export default function MyStoragePage() {
  const { currentUser } = useRole();
  const loading = useSimulatedLoading();

  // Only the signed-in (demo) user's own files – never anyone else's.
  const myFiles = useMemo(
    () =>
      filesByOwner(currentUser.id)
        .filter((f) => f.kind !== "folder")
        .sort((a, b) => b.sizeMB - a.sizeMB),
    [currentUser.id],
  );

  if (loading) {
    return (
      <>
        <HeaderSkeleton />
        <CardGridSkeleton count={3} className="h-40" />
        <div className="mt-4">
          <TableSkeleton rows={6} />
        </div>
      </>
    );
  }

  const pct = percent(currentUser.usedGB, currentUser.quotaGB);
  const freeGB = Math.max(currentUser.quotaGB - currentUser.usedGB, 0);

  return (
    <>
      <PageHeader
        title="My Storage"
        description="Your quota and the files you've stored."
        actions={
          <Button asChild variant="secondary">
            <Link href="/personal">
              <Lock /> Open personal space
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:row-span-1">
          <CardHeader>
            <CardTitle>Quota</CardTitle>
            <CardDescription>Allocated by your admin</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <QuotaRing usedGB={currentUser.usedGB} quotaGB={currentUser.quotaGB} />
            {pct >= 75 && (
              <p className="mt-4 text-center text-xs text-warning">You're running low on space. Ask your admin for more quota.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:col-span-2 sm:grid-cols-3">
          {[
            { label: "Used", value: formatGB(currentUser.usedGB) },
            { label: "Free", value: formatGB(freeGB) },
            { label: "Files", value: String(myFiles.length) },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{s.value}</p>
            </Card>
          ))}

          <Card className="sm:col-span-3">
            <CardHeader>
              <CardTitle>Your files</CardTitle>
              <CardDescription>Largest first · only you can see these</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              {myFiles.length === 0 ? (
                <EmptyState icon={FolderOpen} title="No files yet" description="Upload something in your personal space and it will show up here." />
              ) : (
                <ul className="divide-y divide-border">
                  {myFiles.map((f) => (
                    <li key={f.id} className="flex items-center gap-3 py-2.5">
                      <FileIcon kind={f.kind} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(f.modified)}</p>
                      </div>
                      <Badge variant="muted" className="hidden sm:inline-flex">
                        {KIND_LABEL[f.kind]}
                      </Badge>
                      <span className="w-20 shrink-0 text-right text-sm tabular-nums text-muted-foreground">{formatSize(f.sizeMB)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
