// Initial mock dataset for IITM BS Academic Risk Monitoring & Intervention Platform
import courseAttemptsExcel from './data/course_attempts_from_excel.json'

export const INITIAL_COURSES = [
  // Foundation Level Courses (8 total)
  {
    code: 'MA1001',
    name: 'Mathematics for Data Science I',
    level: 'FOUNDATION',
    credits: 4,
    prerequisites: [],
    termNumber: 1,
    hasOppe: false,
    bottleneck: false
  },
  {
    code: 'CS1001',
    name: 'Computational Thinking',
    level: 'FOUNDATION',
    credits: 4,
    prerequisites: [],
    termNumber: 1,
    hasOppe: false,
    bottleneck: false
  },
  {
    code: 'MA1002',
    name: 'Statistics for Data Science I',
    level: 'FOUNDATION',
    credits: 4,
    prerequisites: [],
    termNumber: 1,
    hasOppe: false,
    bottleneck: false
  },
  {
    code: 'HS1001',
    name: 'English I',
    level: 'FOUNDATION',
    credits: 4,
    prerequisites: [],
    termNumber: 1,
    hasOppe: false,
    bottleneck: false
  },
  {
    code: 'MA1003',
    name: 'Mathematics for Data Science II',
    level: 'FOUNDATION',
    credits: 4,
    prerequisites: ['MA1001'],
    termNumber: 2,
    hasOppe: false,
    bottleneck: true
  },
  {
    code: 'CS1002',
    name: 'Programming in Python',
    level: 'FOUNDATION',
    credits: 4,
    prerequisites: ['CS1001'],
    termNumber: 2,
    hasOppe: true,
    bottleneck: true
  },
  {
    code: 'MA1004',
    name: 'Statistics for Data Science II',
    level: 'FOUNDATION',
    credits: 4,
    prerequisites: ['MA1002'],
    termNumber: 2,
    hasOppe: false,
    bottleneck: true
  },
  {
    code: 'HS1002',
    name: 'English II',
    level: 'FOUNDATION',
    credits: 4,
    prerequisites: ['HS1001'],
    termNumber: 2,
    hasOppe: false,
    bottleneck: false
  },

  // Diploma Level Courses
  {
    code: 'CS2001',
    name: 'Database Management Systems',
    level: 'DIPLOMA',
    credits: 4,
    prerequisites: ['CS1002'],
    termNumber: 3,
    hasOppe: false,
    bottleneck: true
  },
  {
    code: 'CS2002',
    name: 'Programming, Data Structures and Algorithms using Python',
    level: 'DIPLOMA',
    credits: 4,
    prerequisites: ['CS1002'],
    termNumber: 3,
    hasOppe: true,
    bottleneck: true
  },
  {
    code: 'SE2001',
    name: 'System Commands',
    level: 'DIPLOMA',
    credits: 3,
    prerequisites: ['CS1002'],
    termNumber: 3,
    hasOppe: true,
    bottleneck: false
  },
  {
    code: 'CS2003',
    name: 'Modern Application Development I',
    level: 'DIPLOMA',
    credits: 4,
    prerequisites: ['CS2001', 'CS2002'],
    termNumber: 4,
    hasOppe: true,
    bottleneck: false
  },
  {
    code: 'CS2004',
    name: 'Machine Learning Foundations',
    level: 'DIPLOMA',
    credits: 4,
    prerequisites: ['MA1003', 'MA1004', 'CS1002'],
    termNumber: 4,
    hasOppe: false,
    bottleneck: true
  },
  {
    code: 'CS2005',
    name: 'Machine Learning Techniques',
    level: 'DIPLOMA',
    credits: 4,
    prerequisites: ['CS2004'],
    termNumber: 5,
    hasOppe: true,
    bottleneck: false
  },
  {
    code: 'CS2006',
    name: 'Modern Application Development II',
    level: 'DIPLOMA',
    credits: 4,
    prerequisites: ['CS2003'],
    termNumber: 5,
    hasOppe: true,
    bottleneck: false
  },
  {
    code: 'MS2001P',
    name: 'Business Data Management Capstone Project',
    level: 'DIPLOMA',
    credits: 4,
    prerequisites: ['CS2001', 'MA1004'],
    termNumber: 6,
    hasOppe: false,
    bottleneck: false
  }
]

export const INITIAL_TAS = [
  {
    id: 'ta-1',
    name: 'Dr. Priya Ramachandran',
    email: 'ta@demo.com', // Demo TA account
    role: 'Senior Teaching Assistant',
    department: 'Computer Science & Engineering',
    expertise: ['Programming in Python', 'PDSA', 'Machine Learning'],
    assignedCount: 18,
    atRiskCount: 6,
    openInterventions: 3,
    maxCapacity: 25,
    lastActive: '2026-11-01T10:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98401 23456',
    bio: 'Specialist in Python algorithms and introductory programming support for Foundation and Diploma students.'
  },
  {
    id: 'ta-2',
    name: 'Vikram Sen',
    email: 'vikram.sen@ta.iitm.ac.in',
    role: 'Teaching Assistant',
    department: 'Mathematics',
    expertise: ['Mathematics for Data Science I & II', 'Linear Algebra'],
    assignedCount: 22,
    atRiskCount: 8,
    openInterventions: 5,
    maxCapacity: 25,
    lastActive: '2026-11-01T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98402 34567',
    bio: 'Dedicated to helping students overcome conceptual hurdles in Math II and calculus.'
  },
  {
    id: 'ta-3',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@ta.iitm.ac.in',
    role: 'Teaching Assistant',
    department: 'Data Science & Statistics',
    expertise: ['Statistics for Data Science I & II', 'Probability', 'Business Analytics'],
    assignedCount: 14,
    atRiskCount: 3,
    openInterventions: 1,
    maxCapacity: 25,
    lastActive: '2026-10-31T16:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98403 45678',
    bio: 'Focuses on probability distributions and statistical inference.'
  },
  {
    id: 'ta-4',
    name: 'Rahul Swaminathan',
    email: 'rahul.s@ta.iitm.ac.in',
    role: 'Senior Teaching Assistant',
    department: 'Computer Systems',
    expertise: ['Database Management Systems', 'System Commands', 'MAD I'],
    assignedCount: 24,
    atRiskCount: 9,
    openInterventions: 6,
    maxCapacity: 25,
    lastActive: '2026-11-01T11:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98404 56789',
    bio: 'Expert in SQL, PostgreSQL and Linux system administration.'
  },
  {
    id: 'ta-5',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.s@ta.iitm.ac.in',
    role: 'Teaching Assistant',
    department: 'Humanities & Academic Skills',
    expertise: ['English I & II', 'Academic Communication', 'Study Planning'],
    assignedCount: 11,
    atRiskCount: 2,
    openInterventions: 0,
    maxCapacity: 25,
    lastActive: '2026-10-30T14:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98405 67890',
    bio: 'Guides students with time management, reading comprehension and communication skills.'
  },
  {
    id: 'ta-6',
    name: 'Karthik Varma',
    email: 'karthik.v@ta.iitm.ac.in',
    role: 'Teaching Assistant',
    department: 'Computer Science & Engineering',
    expertise: ['Programming in Python', 'OPPE Preparation', 'Computational Thinking'],
    assignedCount: 16,
    atRiskCount: 5,
    openInterventions: 2,
    maxCapacity: 25,
    lastActive: '2026-11-01T08:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98406 78901',
    bio: 'Conducts mock OPPE coding sessions and hands-on debugging workshops.'
  }
]

export const INITIAL_STUDENTS = [
  // Primary Demo Student (Logged in as student@demo.com)
  {
    id: 'student-demo',
    rollNumber: '21F1000542',
    name: 'Aditya Verma',
    email: 'student@demo.com',
    studentEmail: '21f1000542@ds.study.iitm.ac.in',
    phone: '+91 91234 56789',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 5,
    totalTerms: 9,
    intakeCohort: 'Jan 2024',
    riskLevel: 'At Risk', // 'Safe' | 'At Risk' | 'Critical'
    riskScore: 68, // 0-100
    assignedTaId: 'ta-1',
    lastActivity: '2026-11-01T09:40:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',

    // Milestones
    foundationCompleted: 5,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MET', detail: 'Completed 4 courses in Term 4' },
      sixInSix: { status: 'APPROACHING', detail: 'Requires 1 more course completed in Term 6 (1 term left)' },
      eightInNine: { status: 'WARNING', detail: 'Requires 3 courses completed across next 4 terms' }
    },

    // Quick stats
    coursesCompletedCount: 5,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 2,
    quizzesPendingCount: 1,

    // Risk Explanation
    riskFactors: [
      {
        factor: 'Approaching 6-in-6 Milestone Boundary',
        severity: 'High',
        detail: 'Currently completed 5 courses at Term 5. Must complete at least 1 course in Term 6 to avoid milestone breach.',
        impact: '+25 risk points'
      },
      {
        factor: 'Repeat Course Attempt in Programming in Python',
        severity: 'Medium',
        detail: 'Second attempt ongoing for CS1002 (Failed End-Term exam in Term 3).',
        impact: '+20 risk points'
      },
      {
        factor: 'Recent Assignment Submission Lag',
        severity: 'Medium',
        detail: '2 pending weekly assignments overdue in current term courses.',
        impact: '+15 risk points'
      },
      {
        factor: 'OPPE Pending',
        severity: 'Low',
        detail: 'Online Proctored Programming Exam for CS1002 scheduled in 14 days.',
        impact: '+8 risk points'
      }
    ],
    recommendedActions: [
      'Schedule a 1-on-1 OPPE practice drill with your assigned TA Dr. Priya Ramachandran.',
      'Submit pending Week 4 assignments for Programming in Python and Statistics II before Sunday.',
      'Plan registration for Mathematics for Data Science II in Term 6 to guarantee meeting the 6-in-6 milestone.'
    ],

    // Deadlines
    upcomingDeadlines: [
      {
        id: 'dl-1',
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        taskName: 'Week 4 Graded Programming Assignment (GRPA)',
        dueDate: '2026-11-03T23:59:00Z',
        daysRemaining: 2,
        type: 'Assignment'
      },
      {
        id: 'dl-2',
        courseCode: 'MA1004',
        courseName: 'Statistics for Data Science II',
        taskName: 'Quiz 1 Assessment',
        dueDate: '2026-11-06T18:00:00Z',
        daysRemaining: 5,
        type: 'Quiz'
      },
      {
        id: 'dl-3',
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        taskName: 'Online Proctored Programming Exam (OPPE 1)',
        dueDate: '2026-11-15T14:00:00Z',
        daysRemaining: 14,
        type: 'Exam'
      },
      {
        id: 'dl-4',
        courseCode: 'MA1004',
        courseName: 'Statistics for Data Science II',
        taskName: 'Week 6 Activity Assignment',
        dueDate: '2026-11-20T23:59:00Z',
        daysRemaining: 19,
        type: 'Assignment'
      },
      {
        id: 'dl-5',
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        taskName: 'End Term Written Exam',
        dueDate: '2026-12-10T10:00:00Z',
        daysRemaining: 39,
        type: 'Exam'
      }
    ],

    // Course History
    courseHistory: [
      {
        courseCode: 'CS1001',
        courseName: 'Computational Thinking',
        term: 'Term 1 (Jan 2024)',
        termNumber: 1,
        grade: 'A',
        score: 84,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 90,
        quizzesCompleted: '2/2',
        quizzesAvg: 82,
        oppeStatus: 'N/A',
        notes: ''
      },
      {
        courseCode: 'MA1001',
        courseName: 'Mathematics for Data Science I',
        term: 'Term 1 (Jan 2024)',
        termNumber: 1,
        grade: 'B',
        score: 72,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '9/10',
        assignmentsAvg: 78,
        quizzesCompleted: '2/2',
        quizzesAvg: 70,
        oppeStatus: 'N/A',
        notes: ''
      },
      {
        courseCode: 'HS1001',
        courseName: 'English I',
        term: 'Term 2 (May 2024)',
        termNumber: 2,
        grade: 'S',
        score: 95,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 96,
        quizzesCompleted: '2/2',
        quizzesAvg: 94,
        oppeStatus: 'N/A',
        notes: ''
      },
      {
        courseCode: 'MA1002',
        courseName: 'Statistics for Data Science I',
        term: 'Term 2 (May 2024)',
        termNumber: 2,
        grade: 'C',
        score: 61,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '8/10',
        assignmentsAvg: 65,
        quizzesCompleted: '2/2',
        quizzesAvg: 60,
        oppeStatus: 'N/A',
        notes: 'Struggled with conditional probability distributions.'
      },
      {
        courseCode: 'HS1002',
        courseName: 'English II',
        term: 'Term 3 (Sep 2024)',
        termNumber: 3,
        grade: 'A',
        score: 82,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 85,
        quizzesCompleted: '2/2',
        quizzesAvg: 80,
        oppeStatus: 'N/A',
        notes: ''
      },
      {
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        term: 'Term 3 (Sep 2024)',
        termNumber: 3,
        grade: 'U',
        score: 42,
        attempts: 1,
        status: 'Fail',
        assignmentsCompleted: '7/10',
        assignmentsAvg: 60,
        quizzesCompleted: '1/2',
        quizzesAvg: 45,
        oppeStatus: 'Failed (Score: 35/100)',
        notes: 'Failed OPPE exam. Needed repeat registration.'
      },
      {
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        term: 'Term 5 (Jan 2025 - Current)',
        termNumber: 5,
        grade: '—',
        score: null,
        attempts: 2,
        status: 'Ongoing',
        assignmentsCompleted: '2/4',
        assignmentsAvg: 70,
        quizzesCompleted: '0/1',
        quizzesAvg: 0,
        oppeStatus: 'Scheduled',
        notes: 'Enrolled in special TA weekly doubt clearing cohort.'
      },
      {
        courseCode: 'MA1004',
        courseName: 'Statistics for Data Science II',
        term: 'Term 5 (Jan 2025 - Current)',
        termNumber: 5,
        grade: '—',
        score: null,
        attempts: 1,
        status: 'Ongoing',
        assignmentsCompleted: '3/4',
        assignmentsAvg: 75,
        quizzesCompleted: '0/1',
        quizzesAvg: 0,
        oppeStatus: 'N/A',
        notes: ''
      }
    ],

    // Term Grade Averages
    termAverages: [
      { term: 'Term 1', termNumber: 1, avgGradePoint: 8.0, avgScore: 78 },
      { term: 'Term 2', termNumber: 2, avgGradePoint: 7.5, avgScore: 78 },
      { term: 'Term 3', termNumber: 3, avgGradePoint: 5.5, avgScore: 62 },
      { term: 'Term 4', termNumber: 4, avgGradePoint: 7.0, avgScore: 74 },
      { term: 'Term 5', termNumber: 5, avgGradePoint: 6.8, avgScore: 71 } // Projected
    ],

    // Course Planner State
    plannedTerms: [
      {
        term: 1,
        label: 'Term 1',
        courses: ['CS1001', 'MA1001']
      },
      {
        term: 2,
        label: 'Term 2',
        courses: ['HS1001', 'MA1002']
      },
      {
        term: 3,
        label: 'Term 3',
        courses: ['HS1002', 'CS1002']
      },
      {
        term: 4,
        label: 'Term 4',
        courses: []
      },
      {
        term: 5,
        label: 'Term 5 (Current)',
        courses: ['CS1002', 'MA1004']
      },
      {
        term: 6,
        label: 'Term 6',
        courses: ['MA1003']
      },
      {
        term: 7,
        label: 'Term 7',
        courses: ['CS2001', 'CS2002']
      },
      {
        term: 8,
        label: 'Term 8',
        courses: ['CS2003', 'CS2004']
      },
      {
        term: 9,
        label: 'Term 9',
        courses: ['CS2005', 'MS2001P']
      }
    ],

    feasibilityStatus: {
      onTrack: false,
      message: 'At risk of delaying Diploma progression. While 6-in-6 can be met if Term 6 is cleared, you need 2 courses in Term 6 to avoid bottlenecking Term 7 registrations.',
      projectedCompletionTerm: 9,
      recommendedRegistrationCount: 2
    }
  },

  // 2. Critical Student: Sneha Nair
  {
    id: 'student-2',
    rollNumber: '21F1001204',
    name: 'Sneha Nair',
    email: 'sneha.nair@example.com',
    studentEmail: '21f1001204@ds.study.iitm.ac.in',
    phone: '+91 98765 43210',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 6,
    totalTerms: 9,
    intakeCohort: 'May 2023',
    riskLevel: 'Critical',
    riskScore: 89,
    assignedTaId: 'ta-2',
    lastActivity: '2026-10-25T14:10:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 4,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MISSED', detail: 'Completed 3 courses by Term 4' },
      sixInSix: { status: 'MISSED', detail: 'Only 4 courses completed at Term 6' },
      eightInNine: { status: 'CRITICAL', detail: 'Requires 4 courses completed across next 3 terms' }
    },
    coursesCompletedCount: 4,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 5,
    quizzesPendingCount: 2,
    riskFactors: [
      {
        factor: 'Missed 6-in-6 Foundation Checkpoint',
        severity: 'Critical',
        detail: 'Currently completed only 4 of the mandatory 6 courses at Term 6.',
        impact: '+40 risk points'
      },
      {
        factor: 'Multiple Repeated Attempts in Mathematics II',
        severity: 'Critical',
        detail: 'Currently on 3rd attempt in MA1003 (Mathematics for Data Science II).',
        impact: '+30 risk points'
      },
      {
        factor: 'Severe Assignment Disengagement',
        severity: 'High',
        detail: 'Zero assignments submitted for the past 3 consecutive weeks.',
        impact: '+19 risk points'
      }
    ],
    recommendedActions: [
      'Urgent intervention meeting with TA Vikram Sen and Program Academic Advisor.',
      'Apply for course load relaxation or academic counseling before withdrawal deadline.',
      'Enroll in remedial mathematics tutorials.'
    ],
    upcomingDeadlines: [
      {
        id: 'dl-201',
        courseCode: 'MA1003',
        courseName: 'Mathematics for Data Science II',
        taskName: 'Assignment 4 Submission',
        dueDate: '2026-11-02T23:59:00Z',
        daysRemaining: 1,
        type: 'Assignment'
      }
    ],
    courseHistory: [
      {
        courseCode: 'MA1001',
        courseName: 'Mathematics for Data Science I',
        term: 'Term 1',
        termNumber: 1,
        grade: 'C',
        score: 58,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '8/10',
        assignmentsAvg: 60,
        quizzesCompleted: '2/2',
        quizzesAvg: 55,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'CS1001',
        courseName: 'Computational Thinking',
        term: 'Term 2',
        termNumber: 2,
        grade: 'B',
        score: 71,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '9/10',
        assignmentsAvg: 74,
        quizzesCompleted: '2/2',
        quizzesAvg: 68,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'HS1001',
        courseName: 'English I',
        term: 'Term 2',
        termNumber: 2,
        grade: 'A',
        score: 80,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 85,
        quizzesCompleted: '2/2',
        quizzesAvg: 82,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1002',
        courseName: 'Statistics for Data Science I',
        term: 'Term 3',
        termNumber: 3,
        grade: 'D',
        score: 51,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '6/10',
        assignmentsAvg: 54,
        quizzesCompleted: '1/2',
        quizzesAvg: 48,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1003',
        courseName: 'Mathematics for Data Science II',
        term: 'Term 3',
        termNumber: 3,
        grade: 'U',
        score: 38,
        attempts: 1,
        status: 'Fail',
        assignmentsCompleted: '5/10',
        assignmentsAvg: 45,
        quizzesCompleted: '1/2',
        quizzesAvg: 30,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1003',
        courseName: 'Mathematics for Data Science II',
        term: 'Term 4',
        termNumber: 4,
        grade: 'U',
        score: 41,
        attempts: 2,
        status: 'Fail',
        assignmentsCompleted: '4/10',
        assignmentsAvg: 40,
        quizzesCompleted: '1/2',
        quizzesAvg: 35,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1003',
        courseName: 'Mathematics for Data Science II',
        term: 'Term 6 (Current)',
        termNumber: 6,
        grade: '—',
        score: null,
        attempts: 3,
        status: 'Ongoing',
        assignmentsCompleted: '1/4',
        assignmentsAvg: 30,
        quizzesCompleted: '0/1',
        quizzesAvg: 0,
        oppeStatus: 'N/A'
      }
    ],
    termAverages: [
      { term: 'Term 1', termNumber: 1, avgGradePoint: 6.0, avgScore: 58 },
      { term: 'Term 2', termNumber: 2, avgGradePoint: 7.5, avgScore: 75 },
      { term: 'Term 3', termNumber: 3, avgGradePoint: 4.5, avgScore: 44 },
      { term: 'Term 4', termNumber: 4, avgGradePoint: 4.0, avgScore: 41 },
      { term: 'Term 5', termNumber: 5, avgGradePoint: 0.0, avgScore: 0 },
      { term: 'Term 6', termNumber: 6, avgGradePoint: 3.5, avgScore: 35 }
    ]
  },

  // 3. Critical Student: Rohan Gupta
  {
    id: 'student-3',
    rollNumber: '22F2000891',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    studentEmail: '22f2000891@ds.study.iitm.ac.in',
    phone: '+91 97654 32109',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 4,
    totalTerms: 9,
    intakeCohort: 'Jan 2024',
    riskLevel: 'Critical',
    riskScore: 84,
    assignedTaId: 'ta-1',
    lastActivity: '2026-10-28T11:20:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 2,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MISSED', detail: 'Completed 2 courses at Term 4' },
      sixInSix: { status: 'WARNING', detail: 'Requires 4 courses across next 2 terms' },
      eightInNine: { status: 'CRITICAL', detail: 'Severe progression delay' }
    },
    coursesCompletedCount: 2,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 4,
    quizzesPendingCount: 2,
    riskFactors: [
      {
        factor: 'Missed 4-in-4 Foundation Checkpoint',
        severity: 'Critical',
        detail: 'Only 2 courses completed by end of Term 4.',
        impact: '+35 risk points'
      },
      {
        factor: 'Failed OPPE Programming Exam Twice',
        severity: 'High',
        detail: 'CS1002 OPPE 1 and OPPE 2 scores below cutoff.',
        impact: '+30 risk points'
      },
      {
        factor: 'Low Quiz Average',
        severity: 'Medium',
        detail: 'Average quiz score across current courses is 34%.',
        impact: '+19 risk points'
      }
    ],
    recommendedActions: [
      'Attend mandatory lab coding remedial sessions with TA Dr. Priya Ramachandran.',
      'Submit request for academic mentorship for exam prep.'
    ],
    upcomingDeadlines: [
      {
        id: 'dl-301',
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        taskName: 'OPPE Re-attempt Exam',
        dueDate: '2026-11-04T10:00:00Z',
        daysRemaining: 3,
        type: 'Exam'
      }
    ],
    courseHistory: [
      {
        courseCode: 'CS1001',
        courseName: 'Computational Thinking',
        term: 'Term 1',
        termNumber: 1,
        grade: 'C',
        score: 62,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '8/10',
        assignmentsAvg: 65,
        quizzesCompleted: '2/2',
        quizzesAvg: 58,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'HS1001',
        courseName: 'English I',
        term: 'Term 1',
        termNumber: 1,
        grade: 'B',
        score: 75,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '9/10',
        assignmentsAvg: 78,
        quizzesCompleted: '2/2',
        quizzesAvg: 72,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        term: 'Term 2',
        termNumber: 2,
        grade: 'U',
        score: 35,
        attempts: 1,
        status: 'Fail',
        assignmentsCompleted: '6/10',
        assignmentsAvg: 50,
        quizzesCompleted: '1/2',
        quizzesAvg: 30,
        oppeStatus: 'Failed (28/100)'
      },
      {
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        term: 'Term 3',
        termNumber: 3,
        grade: 'U',
        score: 39,
        attempts: 2,
        status: 'Fail',
        assignmentsCompleted: '5/10',
        assignmentsAvg: 42,
        quizzesCompleted: '1/2',
        quizzesAvg: 36,
        oppeStatus: 'Failed (34/100)'
      },
      {
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        term: 'Term 4 (Current)',
        termNumber: 4,
        grade: '—',
        score: null,
        attempts: 3,
        status: 'Ongoing',
        assignmentsCompleted: '1/3',
        assignmentsAvg: 40,
        quizzesCompleted: '0/1',
        quizzesAvg: 0,
        oppeStatus: 'Scheduled'
      }
    ],
    termAverages: [
      { term: 'Term 1', termNumber: 1, avgGradePoint: 6.5, avgScore: 68 },
      { term: 'Term 2', termNumber: 2, avgGradePoint: 3.5, avgScore: 35 },
      { term: 'Term 3', termNumber: 3, avgGradePoint: 3.9, avgScore: 39 },
      { term: 'Term 4', termNumber: 4, avgGradePoint: 4.0, avgScore: 40 }
    ]
  },

  // 4. Safe Student: Ananya Iyer
  {
    id: 'student-4',
    rollNumber: '22F1000101',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    studentEmail: '22f1000101@ds.study.iitm.ac.in',
    phone: '+91 96543 21098',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 3,
    totalTerms: 9,
    intakeCohort: 'May 2024',
    riskLevel: 'Safe',
    riskScore: 12,
    assignedTaId: 'ta-3',
    lastActivity: '2026-11-01T11:05:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 6,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MET', detail: 'Completed 4 courses in Term 2' },
      sixInSix: { status: 'MET', detail: 'Completed 6 courses in Term 3' },
      eightInNine: { status: 'MET', detail: 'On track to finish in Term 4' }
    },
    coursesCompletedCount: 6,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 0,
    quizzesPendingCount: 0,
    riskFactors: [],
    recommendedActions: ['Keep up the excellent pace! Consider planning Diploma course registrations for Term 4.'],
    upcomingDeadlines: [
      {
        id: 'dl-401',
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        taskName: 'GRPA 5',
        dueDate: '2026-11-12T23:59:00Z',
        daysRemaining: 11,
        type: 'Assignment'
      }
    ],
    courseHistory: [
      {
        courseCode: 'MA1001',
        courseName: 'Mathematics for Data Science I',
        term: 'Term 1',
        termNumber: 1,
        grade: 'S',
        score: 96,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 98,
        quizzesCompleted: '2/2',
        quizzesAvg: 95,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'CS1001',
        courseName: 'Computational Thinking',
        term: 'Term 1',
        termNumber: 1,
        grade: 'S',
        score: 94,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 95,
        quizzesCompleted: '2/2',
        quizzesAvg: 93,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1002',
        courseName: 'Statistics for Data Science I',
        term: 'Term 2',
        termNumber: 2,
        grade: 'A',
        score: 88,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 90,
        quizzesCompleted: '2/2',
        quizzesAvg: 86,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'HS1001',
        courseName: 'English I',
        term: 'Term 2',
        termNumber: 2,
        grade: 'S',
        score: 98,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 100,
        quizzesCompleted: '2/2',
        quizzesAvg: 96,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1003',
        courseName: 'Mathematics for Data Science II',
        term: 'Term 3',
        termNumber: 3,
        grade: 'A',
        score: 87,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 88,
        quizzesCompleted: '2/2',
        quizzesAvg: 86,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'HS1002',
        courseName: 'English II',
        term: 'Term 3',
        termNumber: 3,
        grade: 'S',
        score: 92,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 95,
        quizzesCompleted: '2/2',
        quizzesAvg: 90,
        oppeStatus: 'N/A'
      }
    ],
    termAverages: [
      { term: 'Term 1', termNumber: 1, avgGradePoint: 9.8, avgScore: 95 },
      { term: 'Term 2', termNumber: 2, avgGradePoint: 9.2, avgScore: 93 },
      { term: 'Term 3', termNumber: 3, avgGradePoint: 9.0, avgScore: 89.5 }
    ]
  },

  // 5. At Risk: Pooja Patel
  {
    id: 'student-5',
    rollNumber: '21F1003419',
    name: 'Pooja Patel',
    email: 'pooja.patel@example.com',
    studentEmail: '21f1003419@ds.study.iitm.ac.in',
    phone: '+91 95432 10987',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 5,
    totalTerms: 9,
    intakeCohort: 'Jan 2024',
    riskLevel: 'At Risk',
    riskScore: 64,
    assignedTaId: 'ta-2',
    lastActivity: '2026-10-31T17:15:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 5,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MET', detail: 'Completed 4 courses in Term 4' },
      sixInSix: { status: 'APPROACHING', detail: 'Requires 1 more course completed in Term 6' },
      eightInNine: { status: 'WARNING', detail: 'On border pace' }
    },
    coursesCompletedCount: 5,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 2,
    quizzesPendingCount: 1,
    riskFactors: [
      {
        factor: 'Repeat Attempt in Statistics II',
        severity: 'Medium',
        detail: 'MA1004 repeated once.',
        impact: '+22 risk points'
      },
      {
        factor: 'Approaching 6-in-6 Milestone Boundary',
        severity: 'Medium',
        detail: 'Completed 5 courses by Term 5.',
        impact: '+20 risk points'
      }
    ],
    recommendedActions: ['Focus on clearing MA1004 this term to secure 6-in-6 milestone.'],
    upcomingDeadlines: [
      {
        id: 'dl-501',
        courseCode: 'MA1004',
        courseName: 'Statistics for Data Science II',
        taskName: 'Quiz 2',
        dueDate: '2026-11-08T18:00:00Z',
        daysRemaining: 7,
        type: 'Quiz'
      }
    ],
    courseHistory: [
      {
        courseCode: 'CS1001',
        courseName: 'Computational Thinking',
        term: 'Term 1',
        termNumber: 1,
        grade: 'B',
        score: 75,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '9/10',
        assignmentsAvg: 80,
        quizzesCompleted: '2/2',
        quizzesAvg: 70,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1001',
        courseName: 'Mathematics for Data Science I',
        term: 'Term 1',
        termNumber: 1,
        grade: 'C',
        score: 62,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '8/10',
        assignmentsAvg: 68,
        quizzesCompleted: '2/2',
        quizzesAvg: 60,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'HS1001',
        courseName: 'English I',
        term: 'Term 2',
        termNumber: 2,
        grade: 'A',
        score: 84,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '10/10',
        assignmentsAvg: 88,
        quizzesCompleted: '2/2',
        quizzesAvg: 80,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1002',
        courseName: 'Statistics for Data Science I',
        term: 'Term 2',
        termNumber: 2,
        grade: 'B',
        score: 71,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '9/10',
        assignmentsAvg: 75,
        quizzesCompleted: '2/2',
        quizzesAvg: 70,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        term: 'Term 3',
        termNumber: 3,
        grade: 'C',
        score: 60,
        attempts: 1,
        status: 'Pass',
        assignmentsCompleted: '8/10',
        assignmentsAvg: 64,
        quizzesCompleted: '2/2',
        quizzesAvg: 58,
        oppeStatus: 'Cleared (52/100)'
      },
      {
        courseCode: 'MA1004',
        courseName: 'Statistics for Data Science II',
        term: 'Term 4',
        termNumber: 4,
        grade: 'U',
        score: 44,
        attempts: 1,
        status: 'Fail',
        assignmentsCompleted: '6/10',
        assignmentsAvg: 55,
        quizzesCompleted: '1/2',
        quizzesAvg: 40,
        oppeStatus: 'N/A'
      },
      {
        courseCode: 'MA1004',
        courseName: 'Statistics for Data Science II',
        term: 'Term 5 (Current)',
        termNumber: 5,
        grade: '—',
        score: null,
        attempts: 2,
        status: 'Ongoing',
        assignmentsCompleted: '2/3',
        assignmentsAvg: 70,
        quizzesCompleted: '0/1',
        quizzesAvg: 0,
        oppeStatus: 'N/A'
      }
    ],
    termAverages: [
      { term: 'Term 1', termNumber: 1, avgGradePoint: 7.0, avgScore: 68.5 },
      { term: 'Term 2', termNumber: 2, avgGradePoint: 8.0, avgScore: 77.5 },
      { term: 'Term 3', termNumber: 3, avgGradePoint: 6.0, avgScore: 60 },
      { term: 'Term 4', termNumber: 4, avgGradePoint: 4.4, avgScore: 44 },
      { term: 'Term 5', termNumber: 5, avgGradePoint: 7.0, avgScore: 70 }
    ]
  },

  // 6. Safe Student: Vikram Malhotra
  {
    id: 'student-6',
    rollNumber: '22F2000554',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@example.com',
    studentEmail: '22f2000554@ds.study.iitm.ac.in',
    phone: '+91 94321 09876',
    program: 'IITM_BS_DSA',
    currentLevel: 'DIPLOMA',
    termNumber: 4,
    totalTerms: 9,
    intakeCohort: 'Jan 2024',
    riskLevel: 'Safe',
    riskScore: 18,
    assignedTaId: 'ta-4',
    lastActivity: '2026-11-01T08:50:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 8,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MET', detail: 'Completed 4 courses in Term 2' },
      sixInSix: { status: 'MET', detail: 'Completed 6 courses in Term 3' },
      eightInNine: { status: 'MET', detail: 'Completed all 8 Foundation courses in Term 3' }
    },
    coursesCompletedCount: 8,
    coursesInProgressCount: 3,
    assignmentsPendingCount: 0,
    quizzesPendingCount: 1,
    riskFactors: [],
    recommendedActions: ['Steady progress in Diploma in Programming. Keep preparing for MAD I.'],
    upcomingDeadlines: [
      {
        id: 'dl-601',
        courseCode: 'CS2001',
        courseName: 'Database Management Systems',
        taskName: 'SQL Assignment 3',
        dueDate: '2026-11-09T23:59:00Z',
        daysRemaining: 8,
        type: 'Assignment'
      }
    ],
    courseHistory: [
      {
        courseCode: 'CS1001',
        courseName: 'Computational Thinking',
        term: 'Term 1',
        termNumber: 1,
        grade: 'A',
        score: 85,
        attempts: 1,
        status: 'Pass'
      },
      {
        courseCode: 'MA1001',
        courseName: 'Mathematics for Data Science I',
        term: 'Term 1',
        termNumber: 1,
        grade: 'A',
        score: 82,
        attempts: 1,
        status: 'Pass'
      },
      {
        courseCode: 'HS1001',
        courseName: 'English I',
        term: 'Term 1',
        termNumber: 1,
        grade: 'S',
        score: 91,
        attempts: 1,
        status: 'Pass'
      },
      {
        courseCode: 'MA1002',
        courseName: 'Statistics for Data Science I',
        term: 'Term 2',
        termNumber: 2,
        grade: 'B',
        score: 77,
        attempts: 1,
        status: 'Pass'
      },
      {
        courseCode: 'CS1002',
        courseName: 'Programming in Python',
        term: 'Term 2',
        termNumber: 2,
        grade: 'A',
        score: 88,
        attempts: 1,
        status: 'Pass'
      },
      {
        courseCode: 'MA1003',
        courseName: 'Mathematics for Data Science II',
        term: 'Term 3',
        termNumber: 3,
        grade: 'B',
        score: 74,
        attempts: 1,
        status: 'Pass'
      },
      {
        courseCode: 'MA1004',
        courseName: 'Statistics for Data Science II',
        term: 'Term 3',
        termNumber: 3,
        grade: 'B',
        score: 79,
        attempts: 1,
        status: 'Pass'
      },
      {
        courseCode: 'HS1002',
        courseName: 'English II',
        term: 'Term 3',
        termNumber: 3,
        grade: 'A',
        score: 86,
        attempts: 1,
        status: 'Pass'
      }
    ],
    termAverages: [
      { term: 'Term 1', termNumber: 1, avgGradePoint: 8.6, avgScore: 86 },
      { term: 'Term 2', termNumber: 2, avgGradePoint: 8.2, avgScore: 82.5 },
      { term: 'Term 3', termNumber: 3, avgGradePoint: 8.0, avgScore: 79.6 }
    ]
  },

  // 7. Critical: Deepak Chawla
  {
    id: 'student-7',
    rollNumber: '21F3000412',
    name: 'Deepak Chawla',
    email: 'deepak.chawla@example.com',
    studentEmail: '21f3000412@ds.study.iitm.ac.in',
    phone: '+91 93210 98765',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 7,
    totalTerms: 9,
    intakeCohort: 'Sep 2023',
    riskLevel: 'Critical',
    riskScore: 94,
    assignedTaId: 'ta-3',
    lastActivity: '2026-10-20T10:00:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 4,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MISSED', detail: 'Completed 3 courses by Term 4' },
      sixInSix: { status: 'MISSED', detail: 'Only 4 courses completed by Term 6' },
      eightInNine: { status: 'CRITICAL', detail: '4 courses remaining with only 2 terms left' }
    },
    coursesCompletedCount: 4,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 6,
    quizzesPendingCount: 3,
    riskFactors: [
      {
        factor: 'Missed both 4-in-4 and 6-in-6 Milestones',
        severity: 'Critical',
        detail: 'Severe milestone violation across multiple terms.',
        impact: '+45 risk points'
      },
      {
        factor: '4 Repeat Attempts in Statistics for Data Science II',
        severity: 'Critical',
        detail: 'MA1004 has been repeated 4 times without passing.',
        impact: '+35 risk points'
      },
      {
        factor: 'High Disengagement / Prolonged Inactivity',
        severity: 'High',
        detail: 'Last active over 12 days ago.',
        impact: '+14 risk points'
      }
    ],
    recommendedActions: ['Direct escalation to Academic Committee for counseling and progression review.'],
    upcomingDeadlines: [],
    courseHistory: [],
    termAverages: []
  },

  // 8. Safe: Riya Sharma
  {
    id: 'student-8',
    rollNumber: '22F3001092',
    name: 'Riya Sharma',
    email: 'riya.sharma@example.com',
    studentEmail: '22f3001092@ds.study.iitm.ac.in',
    phone: '+91 92109 87654',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 2,
    totalTerms: 9,
    intakeCohort: 'Sep 2024',
    riskLevel: 'Safe',
    riskScore: 8,
    assignedTaId: 'ta-1',
    lastActivity: '2026-11-01T12:30:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 4,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MET', detail: 'Completed 4 courses in Term 2' },
      sixInSix: { status: 'MET', detail: 'On track' },
      eightInNine: { status: 'MET', detail: 'On track' }
    },
    coursesCompletedCount: 4,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 0,
    quizzesPendingCount: 0,
    riskFactors: [],
    recommendedActions: ['Continue strong academic performance.'],
    upcomingDeadlines: [],
    courseHistory: [],
    termAverages: []
  },

  // 9. At Risk: Manish Rao
  {
    id: 'student-9',
    rollNumber: '21F1004812',
    name: 'Manish Rao',
    email: 'manish.rao@example.com',
    studentEmail: '21f1004812@ds.study.iitm.ac.in',
    phone: '+91 91098 76543',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 5,
    totalTerms: 9,
    intakeCohort: 'Jan 2024',
    riskLevel: 'At Risk',
    riskScore: 61,
    assignedTaId: 'ta-4',
    lastActivity: '2026-10-30T15:20:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 5,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MET', detail: 'Completed 4 in Term 4' },
      sixInSix: { status: 'APPROACHING', detail: 'Needs 1 course in Term 6' },
      eightInNine: { status: 'WARNING', detail: 'Moderate risk' }
    },
    coursesCompletedCount: 5,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 3,
    quizzesPendingCount: 1,
    riskFactors: [
      {
        factor: 'Repeat in Computational Thinking',
        severity: 'Medium',
        detail: 'CS1001 repeated in Term 2.',
        impact: '+25 risk points'
      }
    ],
    recommendedActions: ['Maintain weekly assignment submission schedule.'],
    upcomingDeadlines: [],
    courseHistory: [],
    termAverages: []
  },

  // 10. Safe: Kavita Reddy
  {
    id: 'student-10',
    rollNumber: '22F1000993',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@example.com',
    studentEmail: '22f1000993@ds.study.iitm.ac.in',
    phone: '+91 90987 65432',
    program: 'IITM_BS_DSA',
    currentLevel: 'DIPLOMA',
    termNumber: 5,
    totalTerms: 9,
    intakeCohort: 'Jan 2024',
    riskLevel: 'Safe',
    riskScore: 14,
    assignedTaId: 'ta-1',
    lastActivity: '2026-11-01T10:15:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 8,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MET', detail: 'Met' },
      sixInSix: { status: 'MET', detail: 'Met' },
      eightInNine: { status: 'MET', detail: 'Met' }
    },
    coursesCompletedCount: 9,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 0,
    quizzesPendingCount: 0,
    riskFactors: [],
    recommendedActions: ['On track for fast-track degree transition.'],
    upcomingDeadlines: [],
    courseHistory: [],
    termAverages: []
  },

  // 11. Critical: Siddharth Menon
  {
    id: 'student-11',
    rollNumber: '21F2001920',
    name: 'Siddharth Menon',
    email: 'siddharth.m@example.com',
    studentEmail: '21f2001920@ds.study.iitm.ac.in',
    phone: '+91 89876 54321',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 5,
    totalTerms: 9,
    intakeCohort: 'May 2023',
    riskLevel: 'Critical',
    riskScore: 82,
    assignedTaId: 'ta-6',
    lastActivity: '2026-10-27T18:00:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 3,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MISSED', detail: 'Missed at Term 4' },
      sixInSix: { status: 'MISSED', detail: 'Projected miss' },
      eightInNine: { status: 'CRITICAL', detail: 'Critical' }
    },
    coursesCompletedCount: 3,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 4,
    quizzesPendingCount: 2,
    riskFactors: [
      {
        factor: 'Missed 4-in-4 Checkpoint',
        severity: 'Critical',
        detail: 'Completed only 3 courses in 4 terms.',
        impact: '+38 risk points'
      },
      {
        factor: 'Failed Python OPPE Twice',
        severity: 'High',
        detail: 'CS1002 OPPE not cleared.',
        impact: '+30 risk points'
      }
    ],
    recommendedActions: ['Enroll in OPPE bootcamp.'],
    upcomingDeadlines: [],
    courseHistory: [],
    termAverages: []
  },

  // 12. At Risk: Tanvi Joshi
  {
    id: 'student-12',
    rollNumber: '22F2002341',
    name: 'Tanvi Joshi',
    email: 'tanvi.joshi@example.com',
    studentEmail: '22f2002341@ds.study.iitm.ac.in',
    phone: '+91 88765 43210',
    program: 'IITM_BS_DSA',
    currentLevel: 'FOUNDATION',
    termNumber: 4,
    totalTerms: 9,
    intakeCohort: 'May 2024',
    riskLevel: 'At Risk',
    riskScore: 59,
    assignedTaId: 'ta-2',
    lastActivity: '2026-11-01T07:45:00Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    foundationCompleted: 4,
    foundationTotal: 8,
    checkpoints: {
      fourInFour: { status: 'MET', detail: 'Met' },
      sixInSix: { status: 'APPROACHING', detail: 'Needs 2 courses in next 2 terms' },
      eightInNine: { status: 'WARNING', detail: 'Moderate pace' }
    },
    coursesCompletedCount: 4,
    coursesInProgressCount: 2,
    assignmentsPendingCount: 2,
    quizzesPendingCount: 1,
    riskFactors: [
      {
        factor: 'Low Score in Math II Quizzes',
        severity: 'Medium',
        detail: 'Quiz average below 50%.',
        impact: '+22 risk points'
      }
    ],
    recommendedActions: ['Connect with TA Vikram Sen for tutoring.'],
    upcomingDeadlines: [],
    courseHistory: [],
    termAverages: []
  }
]

export const INITIAL_INTERVENTIONS = [
  {
    id: 'int-1',
    studentId: 'student-demo',
    studentName: 'Aditya Verma',
    rollNumber: '21F1000542',
    taId: 'ta-1',
    taName: 'Dr. Priya Ramachandran',
    type: 'One-on-one Session',
    date: '2026-10-22T14:30:00Z',
    outcome: 'Positive Response',
    notes: 'Reviewed past OPPE exam mistakes in Python loops and dictionary manipulation. Provided curated practice problem sets.',
    followUpDue: '2026-11-05T00:00:00Z',
    status: 'Resolved'
  },
  {
    id: 'int-2',
    studentId: 'student-2',
    studentName: 'Sneha Nair',
    rollNumber: '21F1001204',
    taId: 'ta-2',
    taName: 'Vikram Sen',
    type: 'Study Plan Sent',
    date: '2026-10-18T11:00:00Z',
    outcome: 'No Response',
    notes: 'Sent a revised structured study calendar for MA1003 repeat attempt. Student has not responded or opened the calendar link.',
    followUpDue: '2026-10-25T00:00:00Z', // Overdue! (> 7 days)
    status: 'Overdue'
  },
  {
    id: 'int-3',
    studentId: 'student-3',
    studentName: 'Rohan Gupta',
    rollNumber: '22F2000891',
    taId: 'ta-1',
    taName: 'Dr. Priya Ramachandran',
    type: 'Email',
    date: '2026-10-29T16:00:00Z',
    outcome: 'In Progress',
    notes: 'Informed student of the impending 4-in-4 checkpoint status and upcoming OPPE mock test.',
    followUpDue: '2026-11-06T00:00:00Z',
    status: 'Pending'
  },
  {
    id: 'int-4',
    studentId: 'student-7',
    studentName: 'Deepak Chawla',
    rollNumber: '21F3000412',
    taId: 'ta-3',
    taName: 'Ananya Deshmukh',
    type: 'Referral to Admin',
    date: '2026-10-15T09:30:00Z',
    outcome: 'Escalated',
    notes: 'Student has not attended lectures or logged into LMS for 2 weeks. Escalated to Program Academic Advisor.',
    followUpDue: '2026-10-22T00:00:00Z', // Overdue!
    status: 'Overdue'
  },
  {
    id: 'int-5',
    studentId: 'student-5',
    studentName: 'Pooja Patel',
    rollNumber: '21F1003419',
    taId: 'ta-2',
    taName: 'Vikram Sen',
    type: 'One-on-one Session',
    date: '2026-10-26T15:00:00Z',
    outcome: 'Positive Response',
    notes: 'Walked through hypothesis testing and p-value concepts for Statistics II. Student submitted subsequent homework assignment.',
    followUpDue: '2026-11-09T00:00:00Z',
    status: 'Resolved'
  },
  {
    id: 'int-6',
    studentId: 'student-11',
    studentName: 'Siddharth Menon',
    rollNumber: '21F2001920',
    taId: 'ta-6',
    taName: 'Karthik Varma',
    type: 'One-on-one Session',
    date: '2026-10-20T17:00:00Z',
    outcome: 'In Progress',
    notes: 'Conducted live debugging exercise for Python string formatting and matrix traversal.',
    followUpDue: '2026-10-27T00:00:00Z', // Overdue!
    status: 'Overdue'
  }
]

export const INITIAL_MENTORSHIP_REQUESTS = [
  {
    id: 'mr-1',
    studentId: 'student-demo',
    studentName: 'Aditya Verma',
    rollNumber: '21F1000542',
    subject: 'OPPE Help',
    description: 'I failed the Python OPPE in my first attempt due to time management issues in the IDE. I need assistance with live mock coding sessions before the upcoming exam.',
    urgency: 'Urgent',
    courses: ['CS1002 - Programming in Python'],
    submittedAt: '2026-10-28T14:20:00Z',
    status: 'Actioned', // 'Pending' | 'Reviewed' | 'Actioned' | 'Closed'
    adminResponse: 'Dr. Priya Ramachandran has scheduled a personalized 1-on-1 OPPE practice drill with you for Thursday 3 PM.',
    routedTaId: 'ta-1',
    isUnreadByAdmin: false
  },
  {
    id: 'mr-2',
    studentId: 'student-2',
    studentName: 'Sneha Nair',
    rollNumber: '21F1001204',
    subject: 'Academic Difficulty',
    description: 'I am struggling significantly with Mathematics II concepts, particularly eigenvalues and multivariable calculus. I have repeated the course twice and feeling overwhelmed.',
    urgency: 'Urgent',
    courses: ['MA1003 - Mathematics for Data Science II'],
    submittedAt: '2026-10-30T10:15:00Z',
    status: 'Pending',
    adminResponse: null,
    routedTaId: null,
    isUnreadByAdmin: true
  },
  {
    id: 'mr-3',
    studentId: 'student-3',
    studentName: 'Rohan Gupta',
    rollNumber: '22F2000891',
    subject: 'Course Planning',
    description: 'Because I missed the 4-in-4 checkpoint, I want guidance on how to organize my registrations for Term 5 and 6 to clear the Foundation level as fast as possible.',
    urgency: 'Normal',
    courses: ['CS1002 - Programming in Python', 'MA1002 - Statistics for Data Science I'],
    submittedAt: '2026-10-29T16:40:00Z',
    status: 'Reviewed',
    adminResponse: 'We have reviewed your credit history. Please attend the upcoming course advisory session this Friday.',
    routedTaId: 'ta-1',
    isUnreadByAdmin: false
  },
  {
    id: 'mr-4',
    studentId: 'student-9',
    studentName: 'Manish Rao',
    rollNumber: '21F1004812',
    subject: 'Personal Circumstances',
    description: 'I had medical emergencies during Week 3 and missed two quiz deadlines. I would like to request academic counseling on how to recover marks.',
    urgency: 'Normal',
    courses: ['CS1001 - Computational Thinking'],
    submittedAt: '2026-10-31T09:00:00Z',
    status: 'Pending',
    adminResponse: null,
    routedTaId: null,
    isUnreadByAdmin: true
  }
]

export const INITIAL_NOTIFICATIONS = [
  // Student notifications (for student-demo)
  {
    id: 'notif-1',
    recipientType: 'STUDENT',
    recipientId: 'student-demo',
    category: 'Risk', // 'Risk' | 'Academic' | 'TA' | 'System'
    title: 'Academic Standing Alert: At Risk',
    description: 'You have been flagged as At Risk due to approaching the 6-in-6 milestone deadline and an ongoing repeat course attempt in Programming in Python.',
    timestamp: '2026-11-01T08:30:00Z',
    read: false,
    actionType: 'RISK_EXPLANATION',
    actionLabel: 'View Details'
  },
  {
    id: 'notif-2',
    recipientType: 'STUDENT',
    recipientId: 'student-demo',
    category: 'Academic',
    title: 'Missing Assignment Alert',
    description: 'You missed GRPA 4 in Programming in Python. Submit before the late cutoff to avoid grade penalties.',
    timestamp: '2026-10-31T20:00:00Z',
    read: false,
    actionType: 'NAVIGATE',
    actionRoute: '/student/progress',
    actionLabel: 'Check Deadlines'
  },
  {
    id: 'notif-3',
    recipientType: 'STUDENT',
    recipientId: 'student-demo',
    category: 'TA',
    title: 'Teaching Assistant Assigned',
    description: 'Dr. Priya Ramachandran has been assigned as your Teaching Assistant to help with Python OPPE preparation.',
    timestamp: '2026-10-28T15:00:00Z',
    read: true,
    actionType: 'VIEW_TA',
    actionLabel: 'View TA Profile'
  },
  {
    id: 'notif-4',
    recipientType: 'STUDENT',
    recipientId: 'student-demo',
    category: 'System',
    title: 'Mentorship Request Update',
    description: 'Your mentorship request for OPPE Help has been accepted by the Academic Team.',
    timestamp: '2026-10-28T16:00:00Z',
    read: true,
    actionType: 'NAVIGATE',
    actionRoute: '/student/mentorship',
    actionLabel: 'View Response'
  },
  {
    id: 'notif-5',
    recipientType: 'STUDENT',
    recipientId: 'student-demo',
    category: 'Academic',
    title: 'Milestone Warning',
    description: 'At your current rate, you may not meet the 6-course-in-6-term milestone without completing Term 6 courses.',
    timestamp: '2026-10-25T11:00:00Z',
    read: true,
    actionType: 'NAVIGATE',
    actionRoute: '/student/course-planner',
    actionLabel: 'View Course Planner'
  },

  // TA Notifications (for ta-1 Dr. Priya Ramachandran)
  {
    id: 'notif-ta-1',
    recipientType: 'TA',
    recipientId: 'ta-1',
    category: 'Academic',
    title: 'Student Risk Level Upgrade',
    description: "Aditya Verma's (21F1000542) risk status changed from Safe to At Risk. Reason: Approaching 6-in-6 milestone and missed assignment.",
    timestamp: '2026-11-01T08:30:00Z',
    read: false,
    actionType: 'VIEW_STUDENT',
    studentId: 'student-demo',
    actionLabel: 'View Student'
  },
  {
    id: 'notif-ta-2',
    recipientType: 'TA',
    recipientId: 'ta-1',
    category: 'System',
    title: 'New Student Mentorship Request Routed',
    description: "Admin routed Aditya Verma's mentorship request for OPPE Help to you for coordination.",
    timestamp: '2026-10-28T16:00:00Z',
    read: false,
    actionType: 'VIEW_STUDENT',
    studentId: 'student-demo',
    actionLabel: 'View Details'
  },
  {
    id: 'notif-ta-3',
    recipientType: 'TA',
    recipientId: 'ta-1',
    category: 'Academic',
    title: 'Missed Assignment Alert for Assigned Student',
    description: 'Rohan Gupta (22F2000891) missed Assignment 3 in Programming in Python.',
    timestamp: '2026-10-31T21:00:00Z',
    read: true,
    actionType: 'VIEW_STUDENT',
    studentId: 'student-3',
    actionLabel: 'View Student'
  },
  {
    id: 'notif-ta-4',
    recipientType: 'TA',
    recipientId: 'ta-1',
    category: 'Intervention',
    title: 'Intervention Follow-Up Reminder',
    description: 'You logged an intervention for Aditya Verma 10 days ago. Please review and update student outcome.',
    timestamp: '2026-11-01T06:00:00Z',
    read: false,
    actionType: 'UPDATE_OUTCOME',
    interventionId: 'int-1',
    actionLabel: 'Update Outcome'
  }
]

export const INITIAL_ADMIN_ACTIVITY_FEED = [
  {
    id: 'act-1',
    type: 'RISK_CHANGE',
    message: "Aditya Verma's risk status changed from Safe to At Risk",
    timestamp: '2026-11-01T08:30:00Z',
    studentId: 'student-demo',
    studentName: 'Aditya Verma'
  },
  {
    id: 'act-2',
    type: 'TA_ASSIGNMENT',
    message: 'Dr. Priya Ramachandran assigned to Rohan Gupta (22F2000891)',
    timestamp: '2026-10-31T14:15:00Z',
    studentId: 'student-3',
    studentName: 'Rohan Gupta'
  },
  {
    id: 'act-3',
    type: 'MENTORSHIP',
    message: 'New mentorship request received from Pooja Patel (Subject: Academic Difficulty)',
    timestamp: '2026-10-31T09:00:00Z',
    studentId: 'student-5',
    studentName: 'Pooja Patel'
  },
  {
    id: 'act-4',
    type: 'INTERVENTION',
    message: 'Intervention logged by Vikram Sen for Pooja Patel (Outcome: Positive Response)',
    timestamp: '2026-10-26T15:00:00Z',
    studentId: 'student-5',
    studentName: 'Pooja Patel'
  },
  {
    id: 'act-5',
    type: 'MILESTONE_BREACH',
    message: 'Sneha Nair (21F1001204) flagged for missing the 6-in-6 milestone',
    timestamp: '2026-10-25T11:00:00Z',
    studentId: 'student-2',
    studentName: 'Sneha Nair'
  }
]

export const INITIAL_SETTINGS = {
  riskWeights: {
    milestoneDelay: 35,
    assignmentLag: 25,
    oppeFailure: 25,
    repeatAttempts: 15
  },
  riskThresholds: {
    criticalThreshold: 75,
    atRiskThreshold: 50
  },
  signalsEnabled: {
    milestonePace: true,
    assignmentSubmission: true,
    quizPerformance: true,
    oppeFailures: true,
    repeatAttempts: true,
    forumInactivity: true
  },
  taManagement: {
    maxStudentsPerTa: 25,
    alertOverloadThreshold: 22
  },
  notificationTemplates: [
    {
      type: 'RISK_ALERT',
      name: 'Student Risk Warning',
      subject: 'Academic Standing Alert: Action Required',
      body: 'Dear {{student_name}},\n\nYou have been flagged as {{risk_level}} in the IITM BS Degree Program due to: {{risk_reason}}.\n\nPlease review your Course Planner or schedule an intervention session with your assigned Teaching Assistant.'
    },
    {
      type: 'MILESTONE_WARNING',
      name: 'Milestone Pace Notice',
      subject: 'Important: Milestone Checkpoint Reminder',
      body: 'Dear {{student_name}},\n\nBased on your current credit pace in Term {{term_number}}, you are at risk of missing the {{milestone_name}} checkpoint.\n\nPlease log in to review your degree roadmap.'
    },
    {
      type: 'TA_ASSIGNED',
      name: 'TA Assignment Notice',
      subject: 'Teaching Assistant Assigned to Support You',
      body: 'Dear {{student_name}},\n\n{{ta_name}} has been assigned to support you for {{course_name}}. Feel free to contact them for doubt resolution.'
    }
  ]
}

// Sourced directly from data.xlsx
export const EXCEL_REPEAT_COURSE_DATA = courseAttemptsExcel

