import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DollarSign, Download, TrendingUp } from 'lucide-react';
import { formatINR } from '../../utils/currency';

export function EmployeePayroll() {
  const { user } = useAuth();
  const { employees } = useHRData();

  const employee = employees.find(e => e.employeeId === user?.employeeId);

  // Mock payroll data - salary is annual, calculate monthly
  const annualSalary = employee?.salary || 0;
  const monthlySalary = annualSalary / 12;
  
  const salaryStructure = {
    basicSalary: monthlySalary * 0.5, // 50% of monthly is basic
    hra: monthlySalary * 0.2, // 20% HRA
    transport: 25000, // Fixed transport allowance
    medical: 15000, // Fixed medical allowance
    totalEarnings: monthlySalary,
    tax: monthlySalary * 0.1, // 10% tax
    insurance: 10000, // Fixed insurance
    totalDeductions: monthlySalary * 0.1 + 10000,
  };

  const netSalary = salaryStructure.totalEarnings - salaryStructure.totalDeductions;

  const payrollHistory = [
    { month: 'December 2025', gross: salaryStructure.totalEarnings, deductions: salaryStructure.totalDeductions, net: netSalary, status: 'Paid' },
    { month: 'November 2025', gross: salaryStructure.totalEarnings, deductions: salaryStructure.totalDeductions, net: netSalary, status: 'Paid' },
    { month: 'October 2025', gross: salaryStructure.totalEarnings, deductions: salaryStructure.totalDeductions, net: netSalary, status: 'Paid' },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl text-gray-900">Payroll</h1>
            <p className="text-gray-600">View your salary structure and payslips</p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Gross Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{formatINR(salaryStructure.totalEarnings)}</div>
                <p className="text-xs text-gray-500">Per month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Deductions</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{formatINR(salaryStructure.totalDeductions)}</div>
                <p className="text-xs text-gray-500">Tax + Insurance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Net Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{formatINR(netSalary)}</div>
                <p className="text-xs text-gray-500">Take home</p>
              </CardContent>
            </Card>
          </div>

          {/* Salary Structure */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Salary Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Earnings */}
                <div>
                  <h3 className="mb-4 text-sm text-gray-900">Earnings</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Basic Salary</span>
                      <span className="text-sm">{formatINR(salaryStructure.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">HRA (20%)</span>
                      <span className="text-sm">{formatINR(salaryStructure.hra)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Transport Allowance</span>
                      <span className="text-sm">{formatINR(salaryStructure.transport)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Medical Allowance</span>
                      <span className="text-sm">{formatINR(salaryStructure.medical)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-sm">Total Earnings</span>
                      <span className="text-sm">{formatINR(salaryStructure.totalEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="mb-4 text-sm text-gray-900">Deductions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Income Tax (10%)</span>
                      <span className="text-sm">{formatINR(salaryStructure.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Health Insurance</span>
                      <span className="text-sm">{formatINR(salaryStructure.insurance)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-sm">Total Deductions</span>
                      <span className="text-sm">{formatINR(salaryStructure.totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-sm">Net Pay</span>
                      <span className="text-sm text-green-600">{formatINR(netSalary)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll History */}
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.month}</TableCell>
                      <TableCell>{formatINR(record.gross)}</TableCell>
                      <TableCell>{formatINR(record.deductions)}</TableCell>
                      <TableCell className="text-green-600">{formatINR(record.net)}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}