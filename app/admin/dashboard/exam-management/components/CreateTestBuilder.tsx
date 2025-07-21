'use client';

import TestCreator from '@/components/TestCreator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CreateTestBuilder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">📘 Dynamic Test Builder</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <TestCreator />
      </CardContent>
    </Card>
  );
}
