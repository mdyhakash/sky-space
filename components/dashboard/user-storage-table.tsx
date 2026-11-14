import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { users } from "@/lib/mock/users";
import { formatGB, percent, quotaTone } from "@/lib/utils";

export function UserStorageTable() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Storage per user</CardTitle>
        <CardDescription>Used vs allocated quota</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-3">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="pb-2 font-medium">User</th>
              <th className="pb-2 font-medium">Usage</th>
              <th className="pb-2 text-right font-medium">Used / Quota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => {
              const pct = percent(u.usedGB, u.quotaGB);
              return (
                <tr key={u.id}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={u.username} size="sm" />
                      <div className="leading-tight">
                        <p className="font-medium">{u.username}</p>
                        <p className="text-[11px] text-muted-foreground">{u.role === "admin" ? "Admin" : "User"}</p>
                      </div>
                      {u.status === "disabled" && <Badge variant="muted">Disabled</Badge>}
                    </div>
                  </td>
                  <td className="w-[40%] py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Progress value={pct} indicatorClassName={quotaTone(pct)} />
                      <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{Math.round(pct)}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right tabular-nums text-muted-foreground">
                    {formatGB(u.usedGB)} / {formatGB(u.quotaGB, 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
