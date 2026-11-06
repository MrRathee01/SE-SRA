# IIT Madras BS Academic Risk & Intervention Platform

A frontend-only academic monitoring and student-support platform for the IIT Madras BS Degree in Data Science and Applications. It provides distinct workspaces for students, teaching assistants, and administrators, with demo records stored in browser `localStorage`.

## Technology

- Vue 3 Composition API, Vue Router, and Pinia
- Vite
- Tailwind CSS
- Chart.js with `vue-chartjs`
- Lucide Vue icons

## Product design

The interface uses a soft slate foundation, white cards, navy/indigo accents, and gentle semantic risk colors. Pages favor clear hierarchy, whitespace, and concise summaries over dense dashboards. User photos are not stored: the shared `InitialsAvatar` component generates initials with pastel styling.

## Features

### Public home and login

- Public landing page explains the academic monitoring platform and its student, TA, and administrator workflows.
- Responsive login screen provides one-click demo personas and institutional-email/password sign-in.
- Authenticated header role switcher and route guards keep each portal focused on its role.

### Student workspace (`/student/*`)

- **Dashboard:** student identity, current academic standing, risk explanation, 4-in-4 / 6-in-6 / 8-in-9 pacing, course and assessment counts, upcoming deadlines, recent notices, and assigned TA details.
- **Assigned TA availability:** shows the TA's current weekly or monthly consultation days and time windows.
- **Course planner:** term-based course plan, prerequisite guidance and map, pacing/feasibility suggestions, and advisor review request.
- **Progress:** course history, repeat attempts, academic trends, and assignment/quiz tracking.
- **Mentorship requests:** submit a categorized request with relevant courses, urgency, and a description; follow its status and official response. Assigned TA consultation hours are shown alongside the form.
- **Notifications:** filter notices, mark them read, and dismiss them. Changes are persisted.
- **Profile and settings:** view student details, configure notification preferences, and use the demo password-change flow.

### Teaching assistant workspace (`/ta/*`)

- **Dashboard:** assigned-student totals by risk, a clickable risk distribution, assigned-student activity, upcoming deadlines, and filters for searching by name/roll, risk, and term.
- **Student roster:** switch between table and card views, select students for bulk notifications, and open student profiles directly from the roster.
- **Scoped student profile:** overall CGPA, credits cleared, term, and risk standing; course grades, assignments, quizzes, and private notes are restricted to the TA's listed subject expertise. The four-factor risk explanation, checkpoint status, intervention history, and performance trends remain available.
- **Interventions and notes:** log student interventions and follow-ups; private course notes persist in local storage.
- **Consultation schedule:** set weekly or monthly availability, days, and time windows, and revise it during the term.
- **Notifications:** review student-assignment and follow-up alerts, update intervention outcomes, mark alerts read, and dismiss them.

TAs can support students and send administrative notifications, but cannot formally set a student's risk tier.

### Administrator workspace (`/admin/*`)

- **Executive dashboard (`/admin/executive-dashboard`):** program-level attention, intervention outcome, on-track, and TA metrics; an interactive risk distribution; academic score trends by term; and a concise intervention outcome summary.
- **Risk & intervention dashboard (`/admin/dashboard`):** Safe, At Risk, and Critical tier counts link to their matching directory filters; a priority list highlights recently flagged Critical and At Risk students; recent flag activity, milestone pacing, intervention pipeline, and TA capacity.
- **Student directory:** search, filter by level/term/TA, sort, and page through 25/50/100 rows at a time; bulk selection applies to the current page, while CSV export covers all matching records. Open student profiles, assign/reassign a TA, and log interventions.
- **Administrative flagging:** administrators set exactly one tier per student: Safe Standing, At Risk / Watchlist, or Critical Intervention Required. Reclassification updates the student's tier; At Risk and Critical require a rationale. The directory filters by All, Critical, At Risk, and Safe, and its tier badge tooltip shows the flagger, date, and rationale for admin-classified students.
- **Skip-term tracker (`/admin/skip-tracker`):** summarizes students with breaks by academic level and skip count; filters students with two or more skip terms; and provides direct flagging and mentor assignment actions.
- **TA capacity directory:** searchable, paginated TA roster (25/50/100 rows), average caseload and capacity summary cards, utilization meters, status chips, subject specialization, intervention details, and TA registration. Detail modals show short previews with links to full directories.
- **Student profile:** academic history, repeat-course information, intervention records, mentorship requests, risk breakdown, and TA assignment/reassignment wizard.
- **TA assignment wizard:** review student context and TA caseload, expertise, and consultation availability; add an optional message and confirm assignment. Assignment notifications are sent to the student and TA.
- **Interventions:** filter intervention records, review overdue follow-ups, remind TAs, and monitor outcomes.
- **Repeat-course tracker:** analyze aggregate course attempt data from `data.xlsx` and review repeat-course student records.
- **Mentorship inbox:** filter and respond to requests, then route requests to a TA.
- **Notification center:** compose or schedule notices for student audiences and review sent-message history.
- **Settings:** configure risk thresholds and weights, monitoring signals, pacing rules, TA capacity, notification templates, and reset demo data.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@demo.com` | `password123` |
| Teaching Assistant | `ta@demo.com` | `password123` |
| Administrator | `admin@demo.com` | `password123` |

Use the authenticated header's role switcher to change demo perspectives.

## Data and persistence

- Aggregate course-attempt statistics are available in `src/services/mock/data/course_attempts_from_excel.json`.
- Individual student, TA, intervention, and notification records are synthetic demo data in `src/services/mock/initialData.js`.
- `src/services/mock/mockDataService.js` is the centralized data layer; `src/services/mock/storageService.js` persists interactive changes under the `iitm_risk_platform_` local-storage prefix.
- The reset action in the header or administrator settings restores the seeded demo records.

## Project layout

```text
src/
├── components/     # Shared UI, charts, and workflow modals
├── layouts/        # Authenticated application shell
├── pages/          # Home, login, student, TA, and administrator screens
├── router/         # Route definitions and role guards
├── services/mock/  # Seed data, local persistence, and mock data API
├── stores/         # Pinia state for each role and shared features
└── utils/          # Formatting and CSV export helpers
```

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Vite prints the development URL in the terminal. To create and preview a production build:

```bash
npm run build
npm run preview
```
