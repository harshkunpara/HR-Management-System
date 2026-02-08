import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Calendar } from '../../components/ui/calendar';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

export function EmployeeAttendance() {
  const { user } = useAuth();
  const { attendance } = useHRData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const myAttendance = attendance
    .filter(a => a.employeeId === user?.employeeId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30); // Last 30 days

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      present: { variant: 'default', label: 'Present' },
      absent: { variant: 'destructive', label: 'Absent' },
      'half-day': { variant: 'secondary', label: 'Half Day' },
      leave: { variant: 'outline', label: 'Leave' },
    };

    const config = variants[status] || variants.present;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const attendanceDates = myAttendance
    .filter(a => a.status === 'present')
    .map(a => new Date(a.date));

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl text-gray-900">Attendance</h1>
            <p className="text-gray-600">Track your attendance history</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Calendar View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar View
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    present: attendanceDates,
                  }}
                  modifiersStyles={{
                    present: {
                      backgroundColor: '#3b82f6',
                      color: 'white',
                    },
                  }}
                />
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="space-y-6 lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">20 Days</div>
                    <p className="text-xs text-gray-500">Present</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Avg. Check-in</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-2xl">
                      <Clock className="h-5 w-5 text-blue-600" />
                      9:05 AM
                    </div>
                    <p className="text-xs text-gray-500">On time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">180 hrs</div>
                    <p className="text-xs text-gray-500">This month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance History Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myAttendance.length > 0 ? (
                        myAttendance.map((record) => {
                          const hours = record.checkIn && record.checkOut
                            ? Math.abs(
                                new Date(`2000-01-01 ${record.checkOut}`).getTime() -
                                new Date(`2000-01-01 ${record.checkIn}`).getTime()
                              ) / 36e5
                            : 0;

                          return (
                            <TableRow key={record.id}>
                              <TableCell>
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </TableCell>
                              <TableCell>{record.checkIn || '-'}</TableCell>
                              <TableCell>{record.checkOut || '-'}</TableCell>
                              <TableCell>{getStatusBadge(record.status)}</TableCell>
                              <TableCell>{hours > 0 ? `${hours.toFixed(1)}h` : '-'}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
