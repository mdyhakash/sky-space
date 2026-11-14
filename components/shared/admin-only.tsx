"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useRole } from "@/components/providers/role-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

/** Wraps admin-only pages. In the User demo role it shows an access-denied state instead. */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  if (role !== "admin") {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Admins only"
        description="Your account doesn't have access to this page. Switch Demo mode to Admin to preview it."
        action={
          <Button asChild>
            <Link href="/my-storage">Go to My Storage</Link>
          </Button>
        }
      />
    );
  }
  return <>{children}</>;
}
