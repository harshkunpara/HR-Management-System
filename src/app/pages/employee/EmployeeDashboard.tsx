import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { DashboardCard } from '../../components/DashboardCard';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock, Calendar, DollarSign, Bell, LogIn, LogOut as LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const { checkIn, checkOut, attendance, leaveRequests, employees } = useHRData();

  const employee = employees.find(e => e.employeeId === user?.employeeId);
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(
    a => a.employeeId === user?.employeeId && a.date === today
  );

  const myLeaveRequests = leaveRequests.filter(r => r.employeeId === user?.employeeId);
  const pendingRequests = myLeaveRequests.filter(r => r.status === 'pending').length;

  const handleCheckIn = () => {
    if (user) {
      checkIn(user.employeeId);
      toast.success('Checked in successfully!');
    }
  };

  const handleCheckOut = () => {
    if (user) {
      checkOut(user.employeeId);
      toast.success('Checked out successfully!');
    }
  };

  const recentActivities = [
    { date: '2026-01-02', activity: 'Leave request approved', type: 'success' },
    { date: '2025-12-28', activity: 'Payroll processed for December', type: 'info' },
    { date: '2025-12-20', activity: 'Performance review scheduled', type: 'warning' },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Here's what's happening today</p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Today's Attendance</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                {todayAttendance ? (
                  <div>
                    <div className="text-2xl">
                      {todayAttendance.checkIn ? 'Checked In' : 'Not Checked In'}
                    </div>
                    {todayAttendance.checkIn && (
                      <p className="text-xs text-gray-500">
                        In: {todayAttendance.checkIn}
                        {todayAttendance.checkOut && ` | Out: ${todayAttendance.checkOut}`}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      {!todayAttendance.checkIn && (
                        <Button size="sm" onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700">
                          <LogIn className="mr-1 h-4 w-4" />
                          Check In
                        </Button>
                      )}
                      {todayAttendance.checkIn && !todayAttendance.checkOut && (
                        <Button size="sm" onClick={handleCheckOut} className="bg-red-600 hover:bg-red-700">
                          <LogOutIcon className="mr-1 h-4 w-4" />
                          Check Out
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl">Not Checked In</div>
                    <Button size="sm" onClick={handleCheckIn} className="mt-3 bg-green-600 hover:bg-green-700">
                      <LogIn className="mr-1 h-4 w-4" />
                      Check In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <DashboardCard
              title="Leave Balance"
              value={employee?.leaveBalance.paid || 0}
              description={`${pendingRequests} pending request(s)`}
              icon={Calendar}
              iconColor="text-purple-600"
            />

            <DashboardCard
              title="Current Month"
              value={new Date().toLocaleDateString('en-US', { month: 'long' })}
              description="Payroll processed on 1st"
              icon={DollarSign}
              iconColor="text-green-600"
            />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
