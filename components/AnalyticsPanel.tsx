'use client';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const growthData = [
  { date: 'Jan', students: 30 },
  { date: 'Feb', students: 60 },
  { date: 'Mar', students: 90 },
  { date: 'Apr', students: 150 },
  { date: 'May', students: 200 },
  { date: 'Jun', students: 260 },
  { date: 'Jul', students: 320 },
];

const examDistribution = [
  { name: 'CAT', value: 120 },
  { name: 'XAT', value: 80 },
  { name: 'CMAT', value: 60 },
  { name: 'SNAP', value: 40 },
  { name: 'CET', value: 30 },
  { name: 'MAT', value: 20 },
  { name: 'NMAT', value: 25 },
];

const COLORS = ['#2563eb', '#a855f7', '#22d3ee', '#fb7185', '#facc15', '#34d399', '#f59e42'];

const topPercentilers = [
  { name: 'Ananya Verma', exam: 'CAT', percentile: 99.85 },
  { name: 'Rohan Desai', exam: 'XAT', percentile: 99.72 },
  { name: 'Megha Singh', exam: 'CMAT', percentile: 99.5 },
  { name: 'Kunal Roy', exam: 'NMAT', percentile: 98.9 },
];

export default function AnalyticsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 my-6">
      {/* 📈 Line Chart */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">Student Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={growthData}>
              <XAxis dataKey="date" className="text-xs md:text-sm fill-muted-foreground" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📊 Pie Chart */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">Enrolled by Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={examDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#2563eb"
                label
              >
                {examDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🥇 Top Percentilers */}
      <Card className="md:col-span-2 bg-card">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">Top Percentilers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y text-xs md:text-sm">
            {topPercentilers.map((student, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{student.name} ({student.exam})</span>
                <span className="font-semibold text-indigo-600">{student.percentile} %ile</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
