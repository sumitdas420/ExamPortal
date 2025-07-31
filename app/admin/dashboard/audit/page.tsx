'use client';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';

async function fetchAudit() {
  const res = await fetch('/api/audit-logs');
  return res.json();
}

export default function AuditLogPage() {
  const { data = [] } = useQuery({ queryKey: ['audit-logs'], queryFn: fetchAudit });
  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-xl font-bold mb-4 text-foreground">Audit Log</h1>
      <Card className="bg-card">
        <CardContent>
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="text-muted-foreground text-xs">
                <th className="py-2 w-2/12">Time</th>
                <th className="py-2 w-3/12">User</th>
                <th className="py-2 w-7/12">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map((log: any, i: number) => (
                <tr key={i}>
                  <td className="py-1">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-1">{log.username || <i>system</i>}</td>
                  <td className="py-1">{log.action}</td>
                </tr>
              )) : <tr><td colSpan={3} className="text-center text-muted-foreground py-3">No logs</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
