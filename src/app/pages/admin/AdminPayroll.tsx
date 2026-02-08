import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useHRData } from '../../contexts/HRDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DashboardCard } from '../../components/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { formatINR, formatINRL } from '../../utils/currency';

export function AdminPayroll() {
  const { employees } = useHRData();
  
  // Salaries are annual, calculate monthly total
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + (emp.salary / 12), 0);
  const avgMonthlySalary = totalMonthlyPayroll / employees.length;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl text-gray-900">Payroll Management</h1>
            <p className="text-gray-600">Manage employee salaries and payroll</p>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <DashboardCard
              title="Total Monthly Payroll"
              value={formatINRL(totalMonthlyPayroll)}
              description="For all employees"
              icon={DollarSign}
              iconColor="text-green-600"
            />
            <DashboardCard
              title="Average Salary"
              value={formatINRL(avgMonthlySalary)}
              description="Per employee per month"
              icon={TrendingUp}
              iconColor="text-blue-600"
            />
            <DashboardCard
              title="Total Employees"
              value={employees.length}
              description="On payroll"
              icon={Users}
              iconColor="text-purple-600"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Employee Salary Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Annual CTC</TableHead>
                    <TableHead>Monthly Gross</TableHead>
                    <TableHead>Monthly Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => {
                    const monthlySalary = emp.salary / 12;
                    const monthlyDeductions = monthlySalary * 0.1 + 10000;
                    const monthlyNet = monthlySalary - monthlyDeductions;
                    return (
                      <TableRow key={emp.id}>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell>{formatINRL(emp.salary)}</TableCell>
                        <TableCell>{formatINR(monthlySalary)}</TableCell>
                        <TableCell className="text-green-600">{formatINR(monthlyNet)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}