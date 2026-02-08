import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateEmployees, generateAttendance, generateLeaveRequests } from '../utils/mockDataGenerator';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  leaveBalance: {
    paid: number;
    sick: number;
    unpaid: number;
  };
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half-day' | 'leave';
  remarks?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'paid' | 'sick' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

interface HRDataContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollRecord[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  checkIn: (employeeId: string) => void;
  checkOut: (employeeId: string) => void;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
  approveLeaveRequest: (id: string, approvedBy: string, comments?: string) => void;
  rejectLeaveRequest: (id: string, approvedBy: string, comments?: string) => void;
}

const HRDataContext = createContext<HRDataContextType | undefined>(undefined);

// Generate large-scale mock data
const mockEmployees: Employee[] = generateEmployees(1500);
const mockAttendance: AttendanceRecord[] = generateAttendance(mockEmployees);
const mockLeaveRequests: LeaveRequest[] = generateLeaveRequests(mockEmployees);

export function HRDataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [payroll] = useState<PayrollRecord[]>([]);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  };

  const checkIn = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = attendance.find(
      a => a.employeeId === employeeId && a.date === today
    );

    if (!existingRecord) {
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId,
        date: today,
        checkIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        status: 'present',
      };
      setAttendance([...attendance, newRecord]);
    }
  };

  const checkOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendance(attendance.map(record => {
      if (record.employeeId === employeeId && record.date === today) {
        return {
          ...record,
          checkOut: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        };
      }
      return record;
    }));
  };

  const submitLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
    };
    setLeaveRequests([...leaveRequests, newRequest]);
  };

  const approveLeaveRequest = (id: string, approvedBy: string, comments?: string) => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id
        ? {
          ...req,
          status: 'approved',
          approvedBy,
          approvedDate: new Date().toISOString().split('T')[0],
          comments,
        }
        : req
    ));
  };

  const rejectLeaveRequest = (id: string, approvedBy: string, comments?: string) => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id
        ? {
          ...req,
          status: 'rejected',
          approvedBy,
          approvedDate: new Date().toISOString().split('T')[0],
          comments,
        }
        : req
    ));
  };

  return (
    <HRDataContext.Provider
      value={{
        employees,
        attendance,
        leaveRequests,
        payroll,
        addEmployee,
        updateEmployee,
        checkIn,
        checkOut,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
      }}
    >
      {children}
    </HRDataContext.Provider>
  );
}

export function useHRData() {
  const context = useContext(HRDataContext);
  if (context === undefined) {
    throw new Error('useHRData must be used within an HRDataProvider');
  }
  return context;
}