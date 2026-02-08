import { Employee, AttendanceRecord, LeaveRequest } from '../contexts/HRDataContext';

// Indian first names (diverse representation)
const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
  'Aadhya', 'Ananya', 'Pari', 'Anika', 'Diya', 'Aaradhya', 'Sara', 'Kiara', 'Avni', 'Saanvi',
  'Rahul', 'Rohan', 'Amit', 'Raj', 'Ravi', 'Karan', 'Vikram', 'Nikhil', 'Abhishek', 'Suresh',
  'Priya', 'Neha', 'Pooja', 'Sneha', 'Kavya', 'Shruti', 'Anjali', 'Meera', 'Riya', 'Simran',
  'Aryan', 'Dhruv', 'Kabir', 'Shivansh', 'Reyansh', 'Yuvraj', 'Advait', 'Atharva', 'Rudra', 'Shaurya',
  'Anaya', 'Myra', 'Navya', 'Riya', 'Ira', 'Shanaya', 'Tara', 'Zara', 'Mahika', 'Khushi',
  'Sanjay', 'Manoj', 'Vinod', 'Ajay', 'Vijay', 'Deepak', 'Ramesh', 'Sunil', 'Anil', 'Prakash',
  'Lakshmi', 'Divya', 'Swati', 'Rashmi', 'Madhuri', 'Shweta', 'Nisha', 'Rekha', 'Sunita', 'Geeta',
  'Aadhvik', 'Veer', 'Om', 'Pranav', 'Aayush', 'Dev', 'Krish', 'Ansh', 'Shiv', 'Jai',
  'Aarohi', 'Ishita', 'Mira', 'Siya', 'Vanya', 'Nitya', 'Pihu', 'Roshni', 'Tanvi', 'Vidya',
  'Akash', 'Gaurav', 'Harsh', 'Kunal', 'Mohit', 'Naveen', 'Pankaj', 'Rohit', 'Sachin', 'Tarun',
  'Aditi', 'Bhavna', 'Chitra', 'Deepika', 'Eesha', 'Gargi', 'Harini', 'Jyoti', 'Kiran', 'Mansi',
  'Bhaskar', 'Chandan', 'Dinesh', 'Ganesh', 'Hemant', 'Jatin', 'Kamal', 'Lalit', 'Mukesh', 'Naresh',
  'Nandini', 'Pallavi', 'Preeti', 'Radha', 'Sarika', 'Tina', 'Usha', 'Vaishali', 'Yamini', 'Zoya'
];

// Indian last names
const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Joshi', 'Desai', 'Reddy', 'Nair',
  'Mehta', 'Agarwal', 'Rao', 'Iyer', 'Jain', 'Malhotra', 'Chopra', 'Kapoor', 'Kulkarni', 'Pillai',
  'Banerjee', 'Chatterjee', 'Mukherjee', 'Das', 'Bose', 'Ghosh', 'Roy', 'Sen', 'Dutta', 'Saha',
  'Yadav', 'Chauhan', 'Rathore', 'Thakur', 'Bisht', 'Rawat', 'Negi', 'Panwar', 'Tomar', 'Bhandari',
  'Srinivasan', 'Krishnan', 'Swaminathan', 'Narayanan', 'Raman', 'Sundaram', 'Venkatesh', 'Ramesh', 'Shankar', 'Kumar',
  'Khan', 'Ahmed', 'Ali', 'Hussain', 'Mohammad', 'Rahman', 'Siddiqui', 'Ansari', 'Sheikh', 'Qureshi',
  'Menon', 'Namboothiri', 'Warrier', 'Panicker', 'Kurup', 'Unni', 'Kartha', 'Thampi', 'Nambiar', 'Pillai',
  'Bhat', 'Hegde', 'Shetty', 'Rao', 'Pai', 'Kamath', 'Shanbhag', 'Kini', 'Acharya', 'Nayak',
  'Arora', 'Bhatia', 'Khanna', 'Sethi', 'Dhawan', 'Suri', 'Chawla', 'Talwar', 'Kohli', 'Bajaj',
  'Saxena', 'Srivastava', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Tripathi', 'Shukla', 'Rai', 'Dwivedi'
];

// Departments and positions with salary ranges (in INR per annum)
const departmentData = {
  'Engineering': {
    positions: ['Junior Developer', 'Software Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager', 'Principal Engineer', 'VP Engineering'],
    salaryRange: [500000, 4500000]
  },
  'Product': {
    positions: ['Associate PM', 'Product Manager', 'Senior PM', 'Lead PM', 'Director of Product', 'VP Product'],
    salaryRange: [600000, 4000000]
  },
  'Sales': {
    positions: ['Sales Representative', 'Sales Executive', 'Senior Sales Executive', 'Sales Manager', 'Regional Sales Manager', 'VP Sales'],
    salaryRange: [400000, 3500000]
  },
  'Marketing': {
    positions: ['Marketing Associate', 'Marketing Executive', 'Marketing Manager', 'Senior Marketing Manager', 'Marketing Director', 'CMO'],
    salaryRange: [450000, 3800000]
  },
  'Human Resources': {
    positions: ['HR Coordinator', 'HR Executive', 'HR Manager', 'Senior HR Manager', 'HR Director', 'CHRO'],
    salaryRange: [400000, 3200000]
  },
  'Finance': {
    positions: ['Accounts Assistant', 'Accountant', 'Finance Analyst', 'Finance Manager', 'Senior Finance Manager', 'CFO'],
    salaryRange: [380000, 4200000]
  },
  'Operations': {
    positions: ['Operations Coordinator', 'Operations Executive', 'Operations Manager', 'Senior Operations Manager', 'VP Operations'],
    salaryRange: [420000, 3500000]
  },
  'Customer Support': {
    positions: ['Support Associate', 'Support Executive', 'Support Lead', 'Support Manager', 'Head of Support'],
    salaryRange: [300000, 2200000]
  },
  'Design': {
    positions: ['Junior Designer', 'UI/UX Designer', 'Senior Designer', 'Lead Designer', 'Design Manager', 'Head of Design'],
    salaryRange: [480000, 3600000]
  },
  'Data Science': {
    positions: ['Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Head of Data Science'],
    salaryRange: [600000, 4800000]
  },
  'Quality Assurance': {
    positions: ['QA Tester', 'QA Engineer', 'Senior QA Engineer', 'QA Lead', 'QA Manager'],
    salaryRange: [380000, 2500000]
  },
  'Legal': {
    positions: ['Legal Associate', 'Legal Counsel', 'Senior Legal Counsel', 'Legal Director', 'General Counsel'],
    salaryRange: [600000, 4500000]
  }
};

const departments = Object.keys(departmentData);

// Helper function to generate random date
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

// Helper function to generate random time
function randomTime(startHour: number, endHour: number): string {
  const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

// Generate employees
export function generateEmployees(count: number = 1500): Employee[] {
  const employees: Employee[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Generate unique email
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@gmail.com`;
      counter++;
    }
    usedEmails.add(email);

    const department = departments[Math.floor(Math.random() * departments.length)];
    const deptData = departmentData[department as keyof typeof departmentData];
    const position = deptData.positions[Math.floor(Math.random() * deptData.positions.length)];
    
    // Salary based on position level
    const positionIndex = deptData.positions.indexOf(position);
    const salaryMin = deptData.salaryRange[0] + (positionIndex / deptData.positions.length) * (deptData.salaryRange[1] - deptData.salaryRange[0]);
    const salaryMax = salaryMin + 300000;
    const salary = Math.floor(Math.random() * (salaryMax - salaryMin) + salaryMin);

    // Join date between 2020 and 2025
    const joinDate = randomDate(new Date('2020-01-01'), new Date('2025-12-31'));

    // Status - 95% active, 5% inactive
    const status = Math.random() < 0.95 ? 'active' : 'inactive';

    employees.push({
      id: (i + 1).toString(),
      employeeId: `EMP${(i + 1).toString().padStart(4, '0')}`,
      name,
      email,
      department,
      position,
      joinDate,
      salary,
      leaveBalance: {
        paid: Math.floor(Math.random() * 20) + 5,
        sick: Math.floor(Math.random() * 15) + 5,
        unpaid: Math.floor(Math.random() * 10)
      },
      status
    });
  }

  return employees;
}

// Generate attendance records for the last 30 days
export function generateAttendance(employees: Employee[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Only generate for active employees
  const activeEmployees = employees.filter(emp => emp.status === 'active');

  // Generate for last 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateString = date.toISOString().split('T')[0];

    // Skip weekends (assuming Sat/Sun off)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    activeEmployees.forEach((emp, index) => {
      // 90% attendance rate
      if (Math.random() < 0.9) {
        const checkIn = randomTime(8, 11); // Check in between 8-11 AM
        const checkOut = dayOffset === 0 && Math.random() < 0.3 ? undefined : randomTime(17, 20); // Some haven't checked out today
        
        records.push({
          id: `att-${dateString}-${emp.id}`,
          employeeId: emp.employeeId,
          date: dateString,
          checkIn,
          checkOut,
          status: 'present'
        });
      } else {
        // Mark as absent or on leave
        records.push({
          id: `att-${dateString}-${emp.id}`,
          employeeId: emp.employeeId,
          date: dateString,
          status: Math.random() < 0.7 ? 'leave' : 'absent'
        });
      }
    });
  }

  return records;
}

// Generate leave requests
export function generateLeaveRequests(employees: Employee[]): LeaveRequest[] {
  const requests: LeaveRequest[] = [];
  const activeEmployees = employees.filter(emp => emp.status === 'active');
  
  // Generate 200-300 leave requests
  const requestCount = Math.floor(Math.random() * 100) + 200;
  
  for (let i = 0; i < requestCount; i++) {
    const emp = activeEmployees[Math.floor(Math.random() * activeEmployees.length)];
    const type = ['paid', 'sick', 'unpaid'][Math.floor(Math.random() * 3)] as 'paid' | 'sick' | 'unpaid';
    
    // Random dates in the future or recent past
    const startDate = randomDate(new Date('2026-01-01'), new Date('2026-03-31'));
    const endDateObj = new Date(startDate);
    endDateObj.setDate(endDateObj.getDate() + Math.floor(Math.random() * 5)); // 0-5 days leave
    const endDate = endDateObj.toISOString().split('T')[0];
    
    const reasons = [
      'Personal work',
      'Family function',
      'Medical appointment',
      'Vacation',
      'Emergency',
      'Wedding ceremony',
      'Health check-up',
      'Child care',
      'Home renovation',
      'Festival celebration'
    ];

    const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    requests.push({
      id: `leave-${i + 1}`,
      employeeId: emp.employeeId,
      employeeName: emp.name,
      type,
      startDate,
      endDate,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status,
      ...(status !== 'pending' && {
        approvedBy: `EMP${Math.floor(Math.random() * 100).toString().padStart(4, '0')}`,
        approvedDate: randomDate(new Date('2025-12-01'), new Date()),
        comments: status === 'rejected' ? 'Insufficient leave balance' : 'Approved'
      })
    });
  }

  return requests;
}