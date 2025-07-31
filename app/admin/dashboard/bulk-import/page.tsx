'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useMutation } from '@tanstack/react-query';

export default function BulkImportPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/bulk-upload', { method: 'POST', body: data });
      return res.json();
    }
  });

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) mutation.mutate(file);
  }

  return (
    <div className="max-w-lg mx-auto py-6">
      <h1 className="text-xl font-bold mb-4 text-foreground">Bulk Import Users/Questions</h1>
      <Card className="bg-card">
        <CardContent>
          <label className="block text-sm mb-2 text-muted-foreground">Upload CSV file:</label>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleUpload} className="mb-4"/>
          {mutation.isLoading && <span>Uploading...</span>}
          {mutation.isSuccess && <span className="text-green-500">Upload complete!</span>}
        </CardContent>
      </Card>
    </div>
  );
}
