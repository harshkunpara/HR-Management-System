import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useHRData } from '../../contexts/HRDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function AdminReports() {
  const { employees, attendance, leaveRequests } = useHRData();

  // Department distribution
  const departmentData = Array.from(new Set(employees.map(e => e.department))).map(dept => ({
    name: dept,
    count: employees.filter(e => e.department === dept).length,
  }));

  // Leave statistics
  const leaveData = [
    { name: 'Paid', value: leaveRequests.filter(r => r.type === 'paid').length },
    { name: 'Sick', value: leaveRequests.filter(r => r.type === 'sick').length },
    { name: 'Unpaid', value: leaveRequests.filter(r => r.type === 'unpaid').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">View organizational insights and trends</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Leave Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leaveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attendance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { month: 'Aug', rate: 95 },
                      { month: 'Sep', rate: 93 },
                      { month: 'Oct', rate: 97 },
                      { month: 'Nov', rate: 94 },
                      { month: 'Dec', rate: 96 },
                      { month: 'Jan', rate: 95 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" fill="#10b981" name="Attendance %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-sm text-gray-600">Total Employees</span>
                    <span className="text-sm">{employees.length}</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-sm text-gray-600">Average Attendance Rate</span>
                    <span className="text-sm text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-sm text-gray-600">Pending Leave Requests</span>
                    <span className="text-sm">{leaveRequests.filter(r => r.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-sm text-gray-600">Total Payroll</span>
                    <span className="text-sm">${(employees.reduce((sum, e) => sum + e.salary, 0) / 1000).toFixed(0)}K/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Departments</span>
                    <span className="text-sm">{Array.from(new Set(employees.map(e => e.department))).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
