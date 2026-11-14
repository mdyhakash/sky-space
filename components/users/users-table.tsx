"use client";

import { Ellipsis, Trash2, UserCheck, UserX } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/lib/types";
import { QuotaCell } from "./quota-cell";

interface UsersTableProps {
  users: User[];
  onQuotaChange: (id: string, quotaGB: number) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ users, onQuotaChange, onToggleStatus, onDelete }: UsersTableProps) {
  return (
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-5 py-3 font-medium">User</th>
            <th className="px-3 py-3 font-medium">Role</th>
            <th className="px-3 py-3 font-medium">Quota</th>
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="px-3 py-3 font-medium">Last login</th>
            <th className="w-12 px-3 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => {
            const isAdmin = u.role === "admin";
            return (
              <tr key={u.id} className="transition-colors hover:bg-card-2/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={u.username} />
                    <div className="leading-tight">
                      <p className="font-medium">{u.username}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <Badge variant={isAdmin ? "indigo" : "default"}>{isAdmin ? "Admin" : "User"}</Badge>
                </td>
                <td className="px-3 py-3.5">
                  <QuotaCell user={u} onChange={(q) => onQuotaChange(u.id, q)} />
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Switch
                      checked={u.status === "active"}
                      disabled={isAdmin}
                      onCheckedChange={() => onToggleStatus(u.id)}
                      aria-label={`${u.status === "active" ? "Disable" : "Enable"} ${u.username}`}
                    />
                    <Badge variant={u.status === "active" ? "success" : "muted"}>
                      {u.status === "active" ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{u.lastLogin}</td>
                <td className="px-3 py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${u.username}`}>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled={isAdmin} onSelect={() => onToggleStatus(u.id)}>
                        {u.status === "active" ? <UserX /> : <UserCheck />}
                        {u.status === "active" ? "Disable account" : "Enable account"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive disabled={isAdmin} onSelect={() => onDelete(u)}>
                        <Trash2 /> Delete user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
