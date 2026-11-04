# IIT Madras BS Degree Program: Academic Risk Monitoring & Intervention Platform

A complete, production-quality, frontend-only web application designed for the **IIT Madras BS Degree in Data Science and Applications**. The platform enables students, Teaching Assistants (TAs), and Program Administrators to systematically monitor academic standing, detect disengagement and milestone bottlenecks early, and coordinate personalized interventions.

Built with **Vue 3 (Composition API)**, **JavaScript**, **Vite**, **Vue Router**, **Pinia**, **Chart.js**, **Lucide Icons**, and **Tailwind CSS**.

---

## 🌟 Key Features by User Role

### 1. Student Portal (`/student/*`)
- **Student Dashboard (Home)**:
  - Header profile banner with student identity, roll number (`21F1000542`), term status (`Term 5 of 9`), and color-coded **Academic Risk Badge** (🟢 Safe / 🟡 At Risk / 🔴 Critical).
  - Clicking the risk badge opens an interactive **Risk Explanation Modal** with specific contributing factors, severity tags, point impacts, and recommended next steps.
  - **Milestone Progress Card**: Tracks mandatory checkpoints:
    - **4-in-4 Checkpoint**: 4 courses in 4 terms (Met / Approaching / Missed)
    - **6-in-6 Checkpoint**: 6 courses in 6 terms (Prerequisite for Diploma level)
    - **8-in-9 Checkpoint**: 8 Foundation courses in 9 terms deadline countdown.
  - **Quick Stats Row**: Real-time counts for Courses Completed, In-Progress, Pending Assignments, and Quizzes.
  - **Assigned TA Card**: Direct contact trigger and profile summary of linked Teaching Assistant.
  - **Recent Notifications Strip**: Top unread academic and milestone warnings with timestamps.
  - **Upcoming Deadlines Widget**: Next 5 chronological deadlines with color coding (>7 days green, 3–7 days amber, <3 days red).
- **Interactive Course Planner**:
  - Full **9-Term Grid View** displaying completed, in-progress, registered, and blocked courses.
  - Prerequisite lock tooltips (e.g., *"Requires CS1002 Programming in Python to be completed first"*).
  - **Prerequisite Map Visualizer**: Interactive tree/flow chart illustrating prerequisite dependencies across Foundation and Diploma levels, with historic bottleneck courses highlighted in orange.
  - **Feasibility Assessment**: AI-assisted milestone pace evaluation indicating projected completion term and recommended registration load.
  - **Advisor Review Action**: Formally request degree plan verification from academic advisors.
- **My Progress**:
  - **Course History Table**: Sortable and filterable table with terms, grades, repeat attempts (e.g., *"Attempt 2 of 3"* highlighted in orange), and pass/fail statuses.
  - **Performance Trend Chart**: Line chart tracking term-by-term grade point averages against milestone pace benchmarks.
  - **Assignment & Quiz Tracker**: Course-by-course breakdown of homework submission rates and quiz scores.
  - **Repeat Course Section**: Dedicated tracker for courses attempted 2+ times with direct reach-out triggers.
- **Notifications Center**:
  - Filterable alerts categorized by Risk, Academic, TA, and System.
  - "Mark all as read" capability, unread dot indicators, and contextual action buttons.
- **Mentorship Request**:
  - Formal submission form with category dropdown (Academic Difficulty, OPPE Help, Course Planning, Personal Circumstances, Other), 500-character counter, urgency selector (Normal vs Urgent), and course multi-selection.
  - **3-Stage Lifecycle Tracker**: *Submitted → Under Review → Assigned / Responded*.
  - Full request history with official admin responses.
- **Profile & Settings**:
  - Read-only official student records (roll number, registered program, contact information).
  - Granular notification preferences (In-App and Email toggles per category).
  - Password change simulation and linked TA contact details.

---

### 2. Teaching Assistant (TA) Portal (`/ta/*`)
- **TA Dashboard**:
  - **General Stats Tab**: Summary KPI cards (Total Assigned, Critical Risk 🔴, At Risk 🟡, Safe 🟢, Pending Interventions).
  - **Risk Distribution Chart**: Interactive doughnut chart with clickable segments that automatically filter the student cohort.
  - **Live Student Activity Feed**: Timestamped events across assigned students (missed assignments, risk level updates, mentorship requests).
  - **Upcoming Deadlines Widget**: Cross-student assessment calendar with a *"Show only at-risk students' deadlines"* toggle.
  - **Student Overview Tab**:
    - Toggle between **Table View** and **Card Grid View**.
    - Search by student name or roll number; filter by risk level or term.
    - **Bulk Actions Bar**: Select multiple students to dispatch broadcast notifications or flag for Admin Academic Review.
- **Student Profile (TA View)**:
  - Complete student academic history with **Private TA Course Notes** that persist across sessions.
  - Performance trends comparing individual student GPA against anonymized cohort benchmarks.
  - Historical intervention log and **"Log New Intervention" modal** (One-on-one session, Email, Study plan sent, Referral to Admin, Outcome logging, and follow-up target dates).
  - AI Risk Explanation Panel detailing contributing factors and checkpoint status.
- **TA Notifications**:
  - Dedicated alerts for new student assignments, risk status upgrades, missed assignments, and 7-day overdue intervention reminders with quick *"Update Outcome"* modals.
- **TA Profile & Settings**:
  - Staff details, department, course expertise, and active student load overview.

---

### 3. Program Administrator Portal (`/admin/*`)
- **Admin Dashboard**:
  - **6 KPI Cards**: Total Active Students, Critical Students (🔴), At-Risk Students (🟡), Safe Students (🟢), Total Faculty TAs, and Open Interventions.
  - **Risk Distribution Stacked Bar Chart**: Filterable by Level (Foundation/Diploma) and Cohort (Jan 2024, May 2024, etc.) with clickable bars for drill-down.
  - **Milestone Breach Tracker**: Actionable counters for missed 4-in-4 checkpoints, projected 6-in-6 misses, and 8-in-9 warnings.
  - **Intervention Funnel**: Drop-off visualization tracking students across *Flagged → Assigned TA → Intervention Done → Outcome Logged → Resolved*.
  - **Cohort Pacing Comparison**: Comparative bar chart of average credits cleared per term across intake batches.
  - **Program-Wide Activity Stream**: Timestamped audit trail of institutional interventions and escalations.
- **Student Overview Roster**:
  - Sub-tabs for *All Active*, *🔴 Critical*, *🟡 About to Be At Risk*, and *🟢 Safe*.
  - Multi-column sortable table with student search, level/term/TA filters, and pagination.
  - Bulk actions: **Bulk Assign TA**, **Bulk Notification Dispatch**, and **Export Table to CSV**.
  - Row quick-actions: *View Profile*, *Assign TA*, and *Quick Log Intervention*.
- **TA Overview & Capacity Management**:
  - Teaching Assistant directory with student load counters, at-risk caseloads, and open intervention counts.
  - **Workload Balance Chart** with configurable overload limit (e.g., 22 students) and capacity warning banners.
  - Detailed TA modal showing individual student rosters and logged intervention records.
  - Modal form to register new Teaching Assistants into the pool.
- **Admin Student Profile**:
  - All TA profile capabilities plus:
  - **TA Assignment Panel**: Current assignment summary, assignment history ledger, and 4-step reassignment wizard.
  - Program-wide intervention logs from all TAs.
  - **Mentorship Request Inbox**: Inline admin response composer with quick reply templates and routing options.
  - **Repeat Course Tracker**: Tagging patterns such as *"Persistent Difficulty — Referred for Academic Support"*.
  - **AI Risk Score Breakdown**: Transparent formula weights (Milestone Delay 35%, Assignment Lag 25%, OPPE Failure 25%, Repeat Attempts 15%).
- **Multi-Step TA Assignment Wizard**:
  - Step 1: Student risk profile and academic summary.
  - Step 2: Available TA selection showing caseloads, at-risk counts, subject expertise, and **AI Recommended Match** (lowest load + matching course expertise). Admin override allowed.
  - Step 3: Optional guidance note to TA (pre-filled template).
  - Step 4: Confirmation screen that updates mock records and automatically dispatches notifications to both student and TA.
- **Intervention Tracking**:
  - Comprehensive intervention table filterable by outcome, TA, risk level, and date.
  - **Overdue Follow-ups Panel**: Highlights interventions pending >7 days with a one-click *"Remind TA"* nudge.
  - Outcome analytics charts (% Positive, % In Progress, % No Response, % Escalated).
- **Repeat Course / Project Tracker (Powered by `data.xlsx`)**:
  - Sourced directly from the official **data.xlsx** aggregate workbook (91 courses).
  - **Course Bottleneck Chart**: Top 6 most-repeated courses (*CS1002 Programming in Python: 60,671 repeats; MA1003 Maths II: 51,432 repeats; MA1004 Stats II: 47,445 repeats; MA1001 Maths I: 46,136 repeats; MA1002 Stats I: 43,689 repeats*).
  - Clicking any course opens a modal displaying the full distribution of attempts (1st attempt, 2nd attempt, 3rd attempt, up to >9 attempts).
  - Repeat offender student table with actions: *Escalate to Academic Committee*, *Flag for Intervention*, and *Assign TA*.
- **Mentorship Inbox**:
  - Dedicated administrative inbox with urgency indicators, status filters (*Pending*, *Reviewed*, *Actioned*, *Closed*), inline response composer, and *"Route to TA"* delegation.
- **Notification Management Center**:
  - Compose form with audience selector, notification type, message editor with dynamic variable insertion (`{{student_name}}`, `{{risk_reason}}`), immediate broadcast or scheduling simulation, and real-time preview.
  - Historical sent notifications log with simulated read/open rates.
- **System Settings & Configuration**:
  - Interactive sliders to tune risk factor weights.
  - Threshold configuration for Critical and At-Risk boundaries.
  - Individual AI signal toggles (Milestone pace, Assignment submissions, Quiz scores, OPPE attempts, Repeat counts).
  - Milestone progression rules viewer (4-in-4, 6-in-6, 8-in-9).
  - Maximum TA student capacity configuration.
  - Automated notification templates editor.
  - **Reset Demo Data Action** to restore initial seed data at any time.

---

## 🔐 Demo Login Credentials & Role Switcher

The application features a clean demo login screen and an instant **Header Role Switcher** so evaluators can seamlessly toggle between all three roles without repeated logins.

| Role | Demo Email | Password | Persona & Focus |
|---|---|---|---|
| **Student** | `student@demo.com` | `password123` | **Aditya Verma** (Roll: `21F1000542`, Term 5 Foundation, At Risk due to Python repeat & 6-in-6 pace) |
| **Teaching Assistant** | `ta@demo.com` | `password123` | **Dr. Priya Ramachandran** (Senior TA, Computer Science, manages 18 students) |
| **Admin** | `admin@demo.com` | `password123` | **Prof. Rajesh K.** (Academic Coordination Cell, full program oversight) |

> 💡 **Quick Role Switcher**: At the top-right of every authenticated screen, click the **Student**, **TA**, or **Admin** pill button to instantly transition perspectives with preserved context.

---

## 📊 Usage of Provided Excel Data (`data.xlsx`)

The aggregate course attempt data provided in `data.xlsx` has been parsed and integrated into the application's mock analytics layer:
- **Location**: `src/services/mock/data/course_attempts_from_excel.json`
- **Analytics Integration**:
  - **Repeat Course Tracker (`/admin/repeat-tracker`)**: Displays the actual top repeated courses and repeat rates (CS1002 Programming in Python with 66.58% repeat rate, MA1003 Maths II with 62.63% repeat rate, MA1004 Stats II with 63.74%, etc.).
  - **Course Detail Modal**: Displays the exact historical attempt distribution from the Excel workbook (1st attempt, 2nd, 3rd, 4th, 5th, up to >9 attempts).
  - **Prerequisite Map (`/student/course-planner`)**: Identifies courses with repeat rates >40% as curriculum bottlenecks in orange.
- **Distinction of Datasets**:
  - Aggregate course distributions are sourced from `data.xlsx`.
  - Individual student profiles (e.g., Aditya Verma, Sneha Nair) are realistic synthetic mock records simulating the IITM BS degree environment.
  - AI risk predictions and diagnostic scores are simulated algorithmic assessments based on milestone paces and submission records.

---

## 🛠️ Architecture & Mock Data Service

The application follows a clean layered architecture separating UI components, state management, and mock data services:

```
src/
├── assets/
│   └── styles/
│       └── main.css             # Tailwind base & custom design system classes
├── components/
│   ├── charts/                  # Chart.js reusable wrappers (Line, Bar, StackedBar, Doughnut, Funnel)
│   ├── common/                  # AppHeader, AppSidebar, StatCard, RiskBadge, StatusBadge, Modal, Drawer, Toast
│   └── modals/                  # RiskExplanationModal, InterventionModal, TaAssignmentWizard
├── layouts/
│   └── AppLayout.vue            # Main application shell with sidebar, header, toasts & wizards
├── pages/
│   ├── auth/                    # LoginView with 1-click credentials
│   ├── student/                 # 6 Student screens (Dashboard, Planner, Progress, Notifs, Mentorship, Profile)
│   ├── ta/                      # 4 TA screens (Dashboard, Profile View, Notifications, Profile)
│   └── admin/                   # 8 Admin screens (Dashboard, Students, TAs, Interventions, Repeats, Mentorship, Notifs, Settings)
├── router/
│   └── index.js                 # Vue Router configuration with simulated role guards
├── services/
│   └── mock/
│       ├── data/                # Excel parsed JSON and initial mock datasets
│       ├── initialData.js       # Initial seed records (Students, TAs, Interventions, Courses)
│       ├── mockDataService.js   # Centralized data access service (simulates backend API)
│       └── storageService.js    # LocalStorage persistence manager
├── stores/                      # Pinia stores (authStore, studentStore, taStore, adminStore, interventionStore, etc.)
└── utils/                       # formatters.js, exportCsv.js
```

### LocalStorage Persistence & Resetting Data
- All interactive modifications (assigning a TA, logging an intervention, submitting mentorship requests, marking notifications as read, and updating settings) are persisted in the browser's `localStorage` under the prefix `iitm_risk_platform_`.
- To restore the original demo state, click your user avatar in the header and select **"Reset Demo Data"** (or use the button in `/admin/settings`).

### Future Backend API Integration Point
A backend engineer can easily transition this application to a real REST or GraphQL API without refactoring UI components:
1. Replace the methods inside `src/services/mock/mockDataService.js` with actual `fetch` or `axios` calls to your API endpoints.
2. The Pinia stores already interact exclusively with `mockDataService`, keeping components clean and decoupled.

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+ or v10+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port shown in your terminal).

### 3. Build for Production
```bash
npm run build
```
The compiled, minified production assets will be output to the `dist/` directory.

### 4. Preview the Production Build
```bash
npm run preview
```

---

## 📄 License & Attribution
Developed for the **IIT Madras BS Degree Program** (Software Engineering Milestone). Mock aggregate course statistics derived from `data.xlsx`.

