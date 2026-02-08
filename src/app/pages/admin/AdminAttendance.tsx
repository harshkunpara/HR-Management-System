import React, { useState, useMemo } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useHRData } from '../../contexts/HRDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DashboardCard } from '../../components/DashboardCard';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Pagination } from '../../components/Pagination';
import { Clock, Users, TrendingUp, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export function AdminAttendance() {
  const { employees, attendance } = useHRData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = useMemo(() => attendance.filter(a => a.date === today), [attendance, today]);
  const presentToday = useMemo(() => todayAttendance.filter(a => a.status === 'present'), [todayAttendance]);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(employees.map(emp => emp.department));
    return Array.from(depts).sort();
  }, [employees]);

  // Create employee lookup map for better performance
  const employeeMap = useMemo(() => {
    const map = new Map();
    employees.forEach(emp => {
      map.set(emp.employeeId, emp);
    });
    return map;
  }, [employees]);

  // Build attendance records with employee data
  const attendanceRecords = useMemo(() => {
    return employees.map(emp => {
      const record = todayAttendance.find(a => a.employeeId === emp.employeeId);
      return {
        employee: emp,
        attendance: record
      };
    });
  }, [employees, todayAttendance]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(({ employee, attendance }) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      
      const recordStatus = attendance?.status || 'absent';
      const matchesStatus = statusFilter === 'all' || recordStatus === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [attendanceRecords, searchTerm, departmentFilter, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Calculate average check-in time
  const avgCheckIn = useMemo(() => {
    const checkedInRecords = presentToday.filter(a => a.checkIn);
    if (checkedInRecords.length === 0) return '9:00 AM';
    
    const totalMinutes = checkedInRecords.reduce((sum, record) => {
      if (!record.checkIn) return sum;
      const [hours, minutes] = record.checkIn.split(':').map(Number);
      return sum + hours * 60 + minutes;
    }, 0);
    
    const avgMinutes = Math.round(totalMinutes / checkedInRecords.length);
    const hours = Math.floor(avgMinutes / 60);
    const mins = avgMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours;
    
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  }, [presentToday]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl text-gray-900">Attendance Overview</h1>
            <p className="text-gray-600">Organization-wide attendance tracking</p>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <DashboardCard
              title="Present Today"
              value={presentToday.length}
              description={`Out of ${employees.filter(e => e.status === 'active').length} active employees`}
              icon={Users}
              iconColor="text-green-600"
            />
            <DashboardCard
              title="Attendance Rate"
              value={`${Math.round((presentToday.length / employees.filter(e => e.status === 'active').length) * 100)}%`}
              description="Today"
              icon={TrendingUp}
              iconColor="text-blue-600"
            />
            <DashboardCard
              title="Avg. Check-in"
              value={avgCheckIn}
              description="Organization average"
              icon={Clock}
              iconColor="text-purple-600"
            />
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or department..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleFilterChange();
                    }}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Filters:</span>
                  
                  <Select value={departmentFilter} onValueChange={(value) => {
                    setDepartmentFilter(value);
                    handleFilterChange();
                  }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    handleFilterChange();
                  }}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance ({filteredRecords.length} employees)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecords.length > 0 ? (
                      paginatedRecords.map(({ employee, attendance: record }) => {
                        // Calculate hours worked
                        let hoursWorked = '-';
                        if (record?.checkIn && record?.checkOut) {
                          const [inHour, inMin] = record.checkIn.split(':').map(Number);
                          const [outHour, outMin] = record.checkOut.split(':').map(Number);
                          const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
                          const hours = Math.floor(totalMinutes / 60);
                          const mins = totalMinutes % 60;
                          hoursWorked = `${hours}h ${mins}m`;
                        }

                        return (
                          <TableRow key={employee.id}>
                            <TableCell>{employee.employeeId}</TableCell>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{record?.checkIn || '-'}</TableCell>
                            <TableCell>{record?.checkOut || '-'}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  record?.status === 'present' ? 'default' : 
                                  record?.status === 'leave' ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {record?.status || 'absent'}
                              </Badge>
                            </TableCell>
                            <TableCell>{hoursWorked}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No attendance records found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredRecords.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredRecords.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  itemsPerPageOptions={[10, 25, 50, 100]}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPage(1);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}