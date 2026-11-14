import { Download, Link2, LogIn, Upload, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activity } from "@/lib/mock/system";
import type { ActivityType } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

const META: Record<ActivityType, { icon: LucideIcon; tint: string }> = {
  login: { icon: LogIn, tint: "bg-primary/12 text-primary" },
  upload: { icon: Upload, tint: "bg-success/12 text-success" },
  share: { icon: Link2, tint: "bg-indigo/15 text-indigo" },
  download: { icon: Download, tint: "bg-warning/15 text-warning" },
};

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Logins, uploads and share links</CardDescription>
      </CardHeader>
      <CardContent className="pb-5">
        <ol className="relative space-y-4">
          {activity.map((a) => {
            const { icon: Icon, tint } = META[a.type];
            return (
              <li key={a.id} className="flex gap-3">
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${tint}`}>
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{a.user}</span>{" "}
                    <span className="text-muted-foreground">{a.text}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/80">{formatRelative(a.minutesAgo)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
