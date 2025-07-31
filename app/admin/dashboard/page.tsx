'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import AdminTools from '@/components/AdminTools';

export default function AdminDashboardPage() {
  return (
    <div className="relative mt-12 md:mt-0 flex flex-col gap-5 max-w-6xl mx-auto px-2 sm:px-6">
      {/* Heading */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          Welcome back, Admin 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here’s a quick overview of your platform.
        </p>
      </div>

      {/* Compact Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 min-h-[70px]">
            <p className="text-xs text-muted-foreground">Total Exams</p>
            <h2 className="text-lg font-bold text-foreground">12</h2>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 min-h-[70px]">
            <p className="text-xs text-muted-foreground">Total Students</p>
            <h2 className="text-lg font-bold text-foreground">1,430</h2>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 min-h-[70px]">
            <p className="text-xs text-muted-foreground">Recent Enrollments</p>
            <h2 className="text-lg font-bold text-foreground">57</h2>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 min-h-[70px]">
            <p className="text-xs text-muted-foreground">Active Admins</p>
            <h2 className="text-lg font-bold text-foreground">3</h2>
          </CardContent>
        </Card>
      </div>

      {/* Compact Quick Actions */}
      <div className="bg-card rounded-xl shadow-sm p-4">
        <h3 className="text-base font-semibold mb-2 text-foreground">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => window.location.href = '/admin/dashboard/exam-management/create'}
          >
            Create Test
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.location.href = '/admin/dashboard/analytics'}
          >
            View Analytics
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/admin/dashboard/students'}
          >
            Manage Students
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Panels */}
      <div className="space-y-4">
        <AnalyticsPanel />
        <AdminTools />
      </div>
    </div>
  );
}
