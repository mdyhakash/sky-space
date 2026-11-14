"use client";

import { useCallback, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/components/providers/role-provider";
import { AutoLockBadge } from "@/components/personal/auto-lock-badge";
import { FileManager } from "@/components/personal/file-manager";
import { LockScreen } from "@/components/personal/lock-screen";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { filesByOwner } from "@/lib/mock/files";

export default function PersonalPage() {
  const { currentUser } = useRole();
  const [unlockedFor, setUnlockedFor] = useState<string | null>(null);
  const unlocked = unlockedFor === currentUser.id;

  const lock = useCallback(() => setUnlockedFor(null), []);
  const autoLock = useCallback(() => {
    setUnlockedFor(null);
    toast.info("Personal space locked after 10 minutes");
  }, []);

  if (!unlocked) {
    return <LockScreen username={currentUser.username} onUnlock={() => setUnlockedFor(currentUser.id)} />;
  }

  return (
    <>
      <PageHeader
        title="Personal Space"
        description="Private files that only you can see."
        actions={
          <>
            <AutoLockBadge onExpire={autoLock} />
            <Button variant="outline" size="sm" onClick={lock}>
              <Lock /> Lock now
            </Button>
          </>
        }
      />
      {/* key resets the manager when the demo role changes */}
      <FileManager key={currentUser.id} ownerId={currentUser.id} initialFiles={filesByOwner(currentUser.id)} />
    </>
  );
}
