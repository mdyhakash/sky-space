"use client";

import { useState } from "react";
import { UserPlus, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { AdminOnly } from "@/components/shared/admin-only";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { HeaderSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { UsersTable } from "@/components/users/users-table";
import { useSimulatedLoading } from "@/lib/hooks";
import { users as initialUsers } from "@/lib/mock/users";
import type { User } from "@/lib/types";

function UsersView() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);

  const update = (id: string, patch: Partial<User>) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));

  function toggleStatus(id: string) {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    const next = u.status === "active" ? "disabled" : "active";
    update(id, { status: next });
    toast.success(`${u.username} ${next === "active" ? "enabled" : "disabled"}`);
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Everyone with access to this server. Accounts are created by admins only."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <UserPlus /> Create user
          </Button>
        }
      />

      {users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users yet"
          description="Create the first account to invite someone to your server."
          action={<Button onClick={() => setCreateOpen(true)}><UserPlus /> Create user</Button>}
        />
      ) : (
        <UsersTable
          users={users}
          onQuotaChange={(id, quotaGB) => update(id, { quotaGB })}
          onToggleStatus={toggleStatus}
          onDelete={setToDelete}
        />
      )}

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        existingUsernames={users.map((u) => u.username)}
        onCreate={(u) => setUsers((prev) => [...prev, u])}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.username ?? "user"}?`}
        description="Their account and access are removed immediately. Files they uploaded stay on the disk until you clean them up."
        confirmLabel="Delete user"
        onConfirm={() => {
          if (!toDelete) return;
          setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
          toast.success(`${toDelete.username} was deleted`);
        }}
      />
    </>
  );
}

export default function UsersPage() {
  const loading = useSimulatedLoading();
  return (
    <AdminOnly>
      {loading ? (
        <>
          <HeaderSkeleton />
          <TableSkeleton rows={5} />
        </>
      ) : (
        <UsersView />
      )}
    </AdminOnly>
  );
}
