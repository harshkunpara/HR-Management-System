import React, { useState, useMemo } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useHRData } from '../../contexts/HRDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Pagination } from '../../components/Pagination';
import { Check, X, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

export function AdminLeaveRequests() {
  const { user } = useAuth();
  const { leaveRequests } = useHRData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<typeof leaveRequests[0] | null>(null);
  const [comments, setComments] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageProcessed, setCurrentPageProcessed] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const { approveLeaveRequest, rejectLeaveRequest } = useHRData();

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(request => {
      const matchesSearch =
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || request.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [leaveRequests, searchTerm, typeFilter, statusFilter]);

  const pendingRequests = useMemo(() => 
    filteredRequests.filter(r => r.status === 'pending'),
    [filteredRequests]
  );
  
  const processedRequests = useMemo(() => 
    filteredRequests.filter(r => r.status !== 'pending'),
    [filteredRequests]
  );

  // Pagination for pending requests
  const totalPagesPending = Math.ceil(pendingRequests.length / itemsPerPage);
  const paginatedPending = pendingRequests.slice(
    (currentPagePending - 1) * itemsPerPage,
    currentPagePending * itemsPerPage
  );

  // Pagination for processed requests
  const totalPagesProcessed = Math.ceil(processedRequests.length / itemsPerPage);
  const paginatedProcessed = processedRequests.slice(
    (currentPageProcessed - 1) * itemsPerPage,
    currentPageProcessed * itemsPerPage
  );

  const handleFilterChange = () => {
    setCurrentPagePending(1);
    setCurrentPageProcessed(1);
  };

  const handleAction = (request: typeof leaveRequests[0], type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setComments('');
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType || !user) return;

    if (actionType === 'approve') {
      approveLeaveRequest(selectedRequest.id, user.employeeId, comments);
      toast.success('Leave request approved!');
    } else {
      rejectLeaveRequest(selectedRequest.id, user.employeeId, comments);
      toast.success('Leave request rejected!');
    }

    setSelectedRequest(null);
    setActionType(null);
    setComments('');
  };

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
            <h1 className="text-3xl text-gray-900">Leave Requests</h1>
            <p className="text-gray-600">Review and manage employee leave requests</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by employee name or ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleFilterChange();
                    }}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Filters:</span>
                  </div>

                  <Select value={typeFilter} onValueChange={(value) => {
                    setTypeFilter(value);
                    handleFilterChange();
                  }}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="paid">Paid Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    handleFilterChange();
                  }}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  {(typeFilter !== 'all' || statusFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setTypeFilter('all');
                        setStatusFilter('all');
                        handleFilterChange();
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pending Requests ({pendingRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPending.length > 0 ? (
                      paginatedPending.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="text-sm text-gray-900">{request.employeeName}</p>
                              <p className="text-xs text-gray-600">{request.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{request.type}</TableCell>
                          <TableCell>
                            {new Date(request.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            {new Date(request.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAction(request, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAction(request, 'reject')}
                              >
                                <X className="mr-1 h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No pending requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {pendingRequests.length > 0 && (
                <Pagination
                  currentPage={currentPagePending}
                  totalPages={totalPagesPending}
                  totalItems={pendingRequests.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPagePending}
                  itemsPerPageOptions={[10, 25, 50, 100]}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPagePending(1);
                    setCurrentPageProcessed(1);
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Processed Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Processed Requests ({processedRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProcessed.length > 0 ? (
                      paginatedProcessed.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="text-sm text-gray-900">{request.employeeName}</p>
                              <p className="text-xs text-gray-600">{request.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{request.type}</TableCell>
                          <TableCell>
                            {new Date(request.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            {new Date(request.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>{request.approvedBy || '-'}</TableCell>
                          <TableCell className="max-w-xs truncate">{request.comments || '-'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No processed requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {processedRequests.length > 0 && (
                <Pagination
                  currentPage={currentPageProcessed}
                  totalPages={totalPagesProcessed}
                  totalItems={processedRequests.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPageProcessed}
                  itemsPerPageOptions={[10, 25, 50, 100]}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPagePending(1);
                    setCurrentPageProcessed(1);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => {
        setSelectedRequest(null);
        setActionType(null);
        setComments('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Employee</p>
              <p className="text-sm text-gray-900">{selectedRequest?.employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Leave Period</p>
              <p className="text-sm text-gray-900">
                {selectedRequest && `${new Date(selectedRequest.startDate).toLocaleDateString()} - ${new Date(selectedRequest.endDate).toLocaleDateString()}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reason</p>
              <p className="text-sm text-gray-900">{selectedRequest?.reason}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Comments (Optional)</label>
              <Textarea
                placeholder="Add any comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={confirmAction}
                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                variant={actionType === 'reject' ? 'destructive' : 'default'}
              >
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRequest(null);
                  setActionType(null);
                  setComments('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}