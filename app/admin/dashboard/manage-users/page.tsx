'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function fetchUsers() {
  const res = await fetch('/api/admin/manage');
  return res.json();
}
async function promoteUser(id: string) {
  return fetch(`/api/admin/manage`, { method:"POST", body:JSON.stringify({id, role:"ADMIN"}) });
}
export default function ManageUsersPage() {
  const q = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const qc = useQueryClient();
  const mutate = useMutation({ mutationFn: promoteUser, onSuccess: () => qc.invalidateQueries(['users']) });
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-xl font-bold mb-4 text-foreground">Manage Users</h1>
      <Card className="bg-card">
        <CardContent>
          <table className="w-full text-xs">
            <thead>
              <tr><th>Name</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {(q.data ?? []).map((u: any) => (
                <tr key={u.id}>
                  <td>{u.name || u.username}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.role !== "ADMIN" &&
                      <Button size="sm" variant="outline"
                        onClick={() => mutate.mutateAsync(u.id)}>
                        Promote to Admin
                      </Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
