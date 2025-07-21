// app/admin/dashboard/home/page.tsx

import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function DashboardHomePage() {
  return (
    <AdminDashboardLayout>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin 👋</h1>
        <p className="text-gray-500 mt-1">Here’s a quick overview of your platform.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Exams</p>
            <h2 className="text-xl font-bold">12</h2>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Students</p>
            <h2 className="text-xl font-bold">1,430</h2>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Recent Enrollments</p>
            <h2 className="text-xl font-bold">57</h2>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Active Admins</p>
            <h2 className="text-xl font-bold">3</h2>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">
            Create Test
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary">
            View Analytics
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline">
            Manage Students
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
