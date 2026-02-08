import React, { useMemo } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { DashboardCard } from '../../components/DashboardCard';
import { useHRData } from '../../contexts/HRDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Clock, Calendar, DollarSign, CheckSquare } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { formatINRL } from '../../utils/currency';

export function AdminDashboard() {
  const { employees, attendance, leaveRequests } = useHRData();

  const today = new Date().toISOString().split('T')[0];
  
  const todayAttendance = useMemo(() => 
    attendance.filter(a => a.date === today && a.status === 'present'),
    [attendance, today]
  );
  
  const pendingLeaves = useMemo(() => 
    leaveRequests.filter(r => r.status === 'pending'),
    [leaveRequests]
  );
  
  const activeEmployees = useMemo(() => 
    employees.filter(e => e.status === 'active'),
    [employees]
  );

  const recentLeaveRequests = useMemo(() => 
    leaveRequests
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 5),
    [leaveRequests]
  );

  // Calculate department statistics with memoization
  const departmentStats = useMemo(() => {
    const depts = Array.from(new Set(employees.map(e => e.department)));
    return depts.map((dept) => {
      const deptEmployees = employees.filter(e => e.department === dept && e.status === 'active');
      const deptEmployeeIds = new Set(deptEmployees.map(e => e.employeeId));
      const deptAttendance = todayAttendance.filter(a => deptEmployeeIds.has(a.employeeId));
      const attendanceRate = deptEmployees.length > 0
        ? Math.round((deptAttendance.length / deptEmployees.length) * 100)
        : 0;

      return {
        dept,
        employeeCount: deptEmployees.length,
        presentCount: deptAttendance.length,
        attendanceRate
      };
    }).sort((a, b) => b.employeeCount - a.employeeCount); // Sort by employee count
  }, [employees, todayAttendance]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Organization overview and key metrics</p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total Employees"
              value={activeEmployees.length.toLocaleString()}
              description={`${employees.length - activeEmployees.length} inactive`}
              icon={Users}
              iconColor="text-blue-600"
            />

            <DashboardCard
              title="Present Today"
              value={todayAttendance.length.toLocaleString()}
              description={`${Math.round((todayAttendance.length / activeEmployees.length) * 100)}% attendance rate`}
              icon={Clock}
              iconColor="text-green-600"
            />

            <DashboardCard
              title="Pending Leaves"
              value={pendingLeaves.length}
              description="Awaiting approval"
              icon={CheckSquare}
              iconColor="text-yellow-600"
            />

            <DashboardCard
              title="Total Payroll"
              value={formatINRL(activeEmployees.reduce((sum, emp) => sum + (emp.salary / 12), 0))}
              description="Monthly"
              icon={DollarSign}
              iconColor="text-purple-600"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeaveRequests.length > 0 ? (
                    recentLeaveRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{request.employeeName}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                            {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs capitalize text-gray-500">{request.type} leave</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No leave requests</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Department Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Department Overview (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.slice(0, 10).map(({ dept, employeeCount, presentCount, attendanceRate }) => (
                    <div key={dept} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{dept}</p>
                        <p className="text-xs text-gray-600">{employeeCount} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{presentCount} present</p>
                        <p className="text-xs text-gray-600">{attendanceRate}% attendance</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}