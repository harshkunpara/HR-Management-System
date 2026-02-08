import React from 'react';
import { Link, useLocation } from 'react-router';
import { cn } from '../components/ui/utils';
import { 
  LayoutDashboard, 
  User, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  LogOut,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const employeeNav: NavItem[] = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Profile', path: '/employee/profile', icon: <User className="h-5 w-5" /> },
    { name: 'Attendance', path: '/employee/attendance', icon: <Clock className="h-5 w-5" /> },
    { name: 'Leave', path: '/employee/leave', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Payroll', path: '/employee/payroll', icon: <DollarSign className="h-5 w-5" /> },
  ];

  const adminNav: NavItem[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Employees', path: '/admin/employees', icon: <Users className="h-5 w-5" /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <Clock className="h-5 w-5" /> },
    { name: 'Leave Requests', path: '/admin/leave-requests', icon: <CheckSquare className="h-5 w-5" /> },
    { name: 'Payroll', path: '/admin/payroll', icon: <DollarSign className="h-5 w-5" /> },
    { name: 'Reports', path: '/admin/reports', icon: <FileText className="h-5 w-5" /> },
  ];

  const navItems = user?.role === 'employee' ? employeeNav : adminNav;

  return (
    <div className={cn('flex h-screen w-64 flex-col bg-blue-900 text-white', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-blue-800 px-6">
        <h1 className="text-2xl">Dayflow</h1>
      </div>

      {/* User Info */}
      <div className="border-b border-blue-800 p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm">{user?.name}</p>
            <p className="text-xs text-blue-300">{user?.position}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors',
                isActive
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-blue-800 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-blue-100 transition-colors hover:bg-blue-800/50 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}