import React from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { User, Mail, Briefcase, Calendar, Building } from 'lucide-react';

export function EmployeeProfile() {
  const { user } = useAuth();
  const { employees } = useHRData();

  const employee = employees.find(e => e.employeeId === user?.employeeId);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl text-gray-900">Profile</h1>
            <p className="text-gray-600">View and manage your personal information</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-16 w-16 text-blue-600" />
                </div>
                <h3 className="text-lg text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-600">{employee?.position}</p>
                <p className="text-xs text-gray-500">{employee?.employeeId}</p>
                <Button size="sm" variant="outline" className="mt-4">
                  Upload Photo
                </Button>
              </CardContent>
            </Card>

            {/* Details Cards */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="text-sm text-gray-900">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Employee ID</p>
                      <p className="text-sm text-gray-900">{employee?.employeeId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="text-sm text-gray-900">{employee?.position}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="text-sm text-gray-900">{employee?.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Join Date</p>
                      <p className="text-sm text-gray-900">
                        {employee?.joinDate && new Date(employee.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Employment Status</p>
                      <p className="text-sm text-gray-900 capitalize">{employee?.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm text-gray-900">Employment Contract</p>
                        <p className="text-xs text-gray-600">PDF • Uploaded on Jan 15, 2023</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm text-gray-900">ID Proof</p>
                        <p className="text-xs text-gray-600">PDF • Uploaded on Jan 15, 2023</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm text-gray-900">Tax Documents</p>
                        <p className="text-xs text-gray-600">PDF • Uploaded on Jan 15, 2023</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    Upload New Document
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
