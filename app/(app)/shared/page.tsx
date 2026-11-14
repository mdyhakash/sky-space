"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Link2, Lock, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { HeaderSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSimulatedLoading } from "@/lib/hooks";
import { shareLinks as initialLinks } from "@/lib/mock/shares";
import type { ShareLink, ShareStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS: Record<ShareStatus, { label: string; variant: "success" | "muted" | "danger" }> = {
  active: { label: "Active", variant: "success" },
  expired: { label: "Expired", variant: "muted" },
  revoked: { label: "Revoked", variant: "danger" },
};

export default function SharedLinksPage() {
  const loading = useSimulatedLoading();
  const [links, setLinks] = useState<ShareLink[]>(initialLinks);
  const [revoking, setRevoking] = useState<ShareLink | null>(null);

  const activeCount = links.filter((l) => l.status === "active").length;

  if (loading) {
    return (
      <>
        <HeaderSkeleton />
        <TableSkeleton rows={6} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Shared Links" description={`${activeCount} active link${activeCount === 1 ? "" : "s"} · anyone with a link can view it.`} />

      {links.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No share links yet"
          description="Share a photo or album and the link will show up here."
          action={
            <Button asChild>
              <Link href="/photos">Go to Photos</Link>
            </Button>
          }
        />
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-3 py-3 font-medium">Created</th>
                <th className="px-3 py-3 text-right font-medium">Views</th>
                <th className="px-3 py-3 font-medium">Expiry</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map((l) => {
                const s = STATUS[l.status];
                return (
                  <tr key={l.id} className="transition-colors hover:bg-card-2/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Link2 className="size-4" />
                        </span>
                        <div className="min-w-0 leading-tight">
                          <p className="flex items-center gap-1.5 font-medium">
                            <span className="truncate">{l.itemName}</span>
                            {l.passwordProtected && <Lock className="size-3 shrink-0 text-muted-foreground" aria-label="Password protected" />}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground">/s/{l.token}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{formatDate(l.createdAt)}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{l.views}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{l.expiresAt ? formatDate(l.expiresAt) : "Never"}</td>
                    <td className="px-3 py-3.5">
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/s/${l.token}`} target="_blank" aria-label={`Open ${l.itemName}`}>
                            <ExternalLink /> Open
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" disabled={l.status !== "active"} onClick={() => setRevoking(l)}>
                          <ShieldOff /> Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={revoking !== null}
        onOpenChange={(o) => !o && setRevoking(null)}
        title="Revoke this link?"
        description={
          <>
            <span className="font-medium text-foreground">{revoking?.itemName}</span> will stop working immediately. Anyone who has the link will see
            “This link was revoked”.
          </>
        }
        confirmLabel="Revoke link"
        onConfirm={() => {
          if (!revoking) return;
          setLinks((prev) => prev.map((l) => (l.id === revoking.id ? { ...l, status: "revoked" } : l)));
          toast.success(`Revoked “${revoking.itemName}”`);
        }}
      />
    </>
  );
}
