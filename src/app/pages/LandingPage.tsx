import React from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Clock, Calendar, DollarSign, CheckSquare } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: <Clock className="h-12 w-12 text-blue-600" />,
      title: 'Attendance Tracking',
      description: 'Real-time attendance management with check-in/check-out functionality',
    },
    {
      icon: <Calendar className="h-12 w-12 text-blue-600" />,
      title: 'Leave Management',
      description: 'Streamlined leave request and approval workflow for all employees',
    },
    {
      icon: <DollarSign className="h-12 w-12 text-blue-600" />,
      title: 'Payroll Visibility',
      description: 'Complete transparency in salary structure and monthly payroll',
    },
    {
      icon: <CheckSquare className="h-12 w-12 text-blue-600" />,
      title: 'Approval Workflows',
      description: 'Efficient approval processes for leave requests and time-off',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-6xl text-blue-900">Dayflow</h1>
          <p className="mb-2 text-xl text-gray-600">
            Human Resource Management System
          </p>
          <p className="mb-8 text-lg italic text-blue-600">
            Every workday, perfectly aligned.
          </p>
          <p className="mx-auto mb-12 max-w-2xl text-gray-600">
            A complete solution to digitize and streamline core HR operations.
            Manage attendance, leave requests, payroll, and approvals all in one place.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl text-gray-900">
          Key Features
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="mb-2 text-lg text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 Dayflow HRMS. Built for small to mid-size organizations.</p>
          <p className="mt-2">Modern. Professional. Scalable.</p>
        </div>
      </footer>
    </div>
  );
}