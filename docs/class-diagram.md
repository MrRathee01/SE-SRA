# Frontend Class Diagram

This diagram summarizes the current Vue/Pinia frontend's runtime architecture and the domain objects managed by its mock data layer. The UI uses JavaScript objects rather than a backend ORM.

```mermaid
classDiagram
direction LR

class AuthStore {
  +currentRole: Role
  +currentUser: DemoAccount
  +login(email, password)
  +switchRole(role)
  +logout()
  +resetPlatformData()
}

class AdminStore {
  +studentActiveTab: String
  +studentSearchQuery: String
  +selectedStudentIds: String[]
  +allStudents: Student[]
  +allTas: TeachingAssistant[]
  +filteredStudents: Student[]
  +filteredTas: TeachingAssistant[]
  +flagStudent(studentId, tier, reason)
  +confirmAssignment()
  +exportStudentsToCsv()
}

class StudentStore {
  +student: Student
  +courses: Course[]
  +assignedTa: TeachingAssistant
  +mentorshipRequests: MentorshipRequest[]
  +notifPreferences: NotificationPreferences
  +submitMentorshipRequest(data)
  +saveNotificationPreferences(data)
}

class TaStore {
  +currentTaId: String
  +assignedStudents: Student[]
  +filteredAssignedStudents: Student[]
  +stats: Object
  +aggregatedDeadlines: Deadline[]
  +sendBulkNotification(message)
  +saveCourseNote(studentId, courseCode, note)
}

class InterventionStore {
  +allInterventions: Intervention[]
  +filteredInterventions: Intervention[]
  +outcomeStats: Object
  +logIntervention(data)
  +updateOutcome(id, outcome, notes)
  +remindTa(id)
}

class NotificationStore {
  +currentNotifications: Notification[]
  +unreadCount: Number
  +sentNotificationsLog: Object[]
  +markAsRead(id)
  +deleteNotification(id)
  +sendAdminNotification(data)
}

class SettingsStore {
  +settings: PlatformSettings
  +updateRiskWeights(weights)
  +updateThresholds(thresholds)
  +toggleSignal(signalKey)
  +updateTaCapacity(maxStudents)
}

class ToastStore {
  +toasts: Toast[]
  +success(message)
  +error(message)
  +warning(message)
  +info(message)
}

class MockDataService {
  +students: Student[]
  +tas: TeachingAssistant[]
  +courses: Course[]
  +interventions: Intervention[]
  +mentorshipRequests: MentorshipRequest[]
  +notifications: Notification[]
  +activityFeed: ActivityEvent[]
  +settings: PlatformSettings
  +assignTaToStudent(studentId, taId, message)
  +flagStudent(studentId, tier, reason, adminName)
  +createMentorshipRequest(data)
  +logIntervention(data)
  +sendBulkNotifications(data)
  +saveAll()
  +resetToDefaults()
}

class StorageService {
  +getItem(key, defaultValue)
  +setItem(key, value)
  +removeItem(key)
  +clearAllPlatformData()
}

class DemoAccount {
  +id: String
  +email: String
  +name: String
  +role: Role
}

class Student {
  +id: String
  +rollNumber: String
  +name: String
  +email: String
  +studentEmail: String
  +program: String
  +currentLevel: String
  +termNumber: Number
  +intakeCohort: String
  +riskLevel: RiskTier
  +riskScore: Number
  +status: String
  +assignedTaId: String
  +foundationCompleted: Number
  +skipTerms: Number
}

class RiskFlag {
  +isFlagged: Boolean
  +category: RiskTier
  +flaggedBy: String
  +flaggedAt: DateTime
  +reason: String
}

class StudentCheckpoint {
  +checkpointCode: String
  +status: String
  +detail: String
}

class RiskFactor {
  +factor: String
  +severity: String
  +detail: String
  +impact: String
}

class CourseHistoryEntry {
  +courseCode: String
  +termNumber: Number
  +grade: String
  +score: Number
  +attempts: Number
  +status: String
  +assignmentsAvg: Number
  +quizzesAvg: Number
}

class Deadline {
  +id: String
  +courseCode: String
  +taskName: String
  +dueDate: DateTime
  +daysRemaining: Number
  +type: String
}

class SkipTerm {
  +term: String
  +reason: String
}

class TeachingAssistant {
  +id: String
  +name: String
  +email: String
  +department: String
  +expertise: String[]
  +assignedCount: Number
  +atRiskCount: Number
  +maxCapacity: Number
  +lastActive: DateTime
  +schedulePreferences: SchedulePreferences
}

class SchedulePreferences {
  +days: String[]
  +slots: String[]
  +frequency: String
  +lastUpdated: DateTime
  +activeTerm: String
}

class Course {
  +code: String
  +name: String
  +level: String
  +credits: Number
  +termNumber: Number
  +hasOppe: Boolean
  +bottleneck: Boolean
}

class Intervention {
  +id: String
  +studentId: String
  +taId: String
  +type: String
  +date: DateTime
  +outcome: String
  +notes: String
  +followUpDue: DateTime
  +status: String
}

class MentorshipRequest {
  +id: String
  +studentId: String
  +subject: String
  +description: String
  +urgency: String
  +courses: String[]
  +submittedAt: DateTime
  +status: String
  +adminResponse: String
  +routedTaId: String
}

class Notification {
  +id: String
  +recipientType: String
  +recipientId: String
  +category: String
  +title: String
  +description: String
  +timestamp: DateTime
  +read: Boolean
  +actionType: String
  +actionRoute: String
}

class ActivityEvent {
  +id: String
  +type: String
  +message: String
  +timestamp: DateTime
  +studentId: String
  +reason: String
}

class PlatformSettings {
  +riskWeights: Object
  +riskThresholds: Object
  +signalsEnabled: Object
  +taManagement: Object
  +notificationTemplates: Object[]
}

class NotificationPreferences {
  +riskAlertsInApp: Boolean
  +riskAlertsEmail: Boolean
  +taUpdatesInApp: Boolean
  +taUpdatesEmail: Boolean
  +deadlinesInApp: Boolean
  +deadlinesEmail: Boolean
  +mentorshipInApp: Boolean
  +mentorshipEmail: Boolean
}

class TaCourseNote {
  +studentId: String
  +courseCode: String
  +note: String
}

class CourseRepeatAggregate {
  +courseCode: String
  +courseName: String
  +attemptCounts: Object
  +totalStudents: Number
  +totalRepeats: Number
  +repeatRatePct: Number
}

AuthStore ..> StorageService : persists current user
AuthStore ..> MockDataService : resets demo state
AdminStore ..> AuthStore : enforces admin flagging
AdminStore ..> MockDataService : queries and mutates records
StudentStore ..> MockDataService : student workflows
StudentStore ..> StorageService : notification preferences
TaStore ..> MockDataService : TA workflows
InterventionStore ..> MockDataService : intervention workflows
NotificationStore ..> AuthStore : selects recipient role
NotificationStore ..> MockDataService : notification workflows
SettingsStore ..> MockDataService : settings persistence
MockDataService ..> StorageService : localStorage adapter

Student "1" *-- "0..1" RiskFlag : current flagStatus
Student "1" *-- "0..*" StudentCheckpoint : checkpoints
Student "1" *-- "0..*" RiskFactor : riskFactors
Student "1" *-- "0..*" CourseHistoryEntry : courseHistory
Student "1" *-- "0..*" Deadline : upcomingDeadlines
Student "1" *-- "0..*" SkipTerm : skipTermsHistory
TeachingAssistant "0..1" <-- "0..*" Student : assignedTaId
TeachingAssistant "1" *-- "0..1" SchedulePreferences : availability
Student "1" --> "0..*" Intervention : receives
TeachingAssistant "1" --> "0..*" Intervention : conducts
Student "1" --> "0..*" MentorshipRequest : submits
TeachingAssistant "0..1" <-- "0..*" MentorshipRequest : routedTaId
Student "0..1" <-- "0..*" Notification : recipient
TeachingAssistant "0..1" <-- "0..*" Notification : recipient
Student "0..1" <-- "0..*" ActivityEvent : subject
Student "1" --> "0..*" TaCourseNote : has private notes
TeachingAssistant "1" --> "0..*" TaCourseNote : authors
Course "1" --> "0..*" CourseHistoryEntry : courseCode
Course "1" --> "0..*" TaCourseNote : courseCode
Course ..> CourseRepeatAggregate : analytics sourced from JSON
Student ..> NotificationPreferences : per-student preferences
MockDataService o-- Student
MockDataService o-- TeachingAssistant
MockDataService o-- Course
MockDataService o-- Intervention
MockDataService o-- MentorshipRequest
MockDataService o-- Notification
MockDataService o-- ActivityEvent
MockDataService o-- PlatformSettings
```

## Interpretation notes

- `RiskFlag` is the current classification stored on each student. `ActivityEvent` records tier changes over time.
- `CourseHistoryEntry`, checkpoints, risk factors, skip-term history, and deadlines are currently nested in student JSON records.
- `DemoAccount` is an in-memory demo persona; `currentUser` is persisted in browser storage. There is no backend identity service.
- `CourseRepeatAggregate` is loaded from `src/services/mock/data/course_attempts_from_excel.json`; it is aggregate course data, separate from an individual student's course history.
- Pinia stores own UI state and derived views. `MockDataService` is the shared mock-domain service, and `StorageService` serializes selected collections to localStorage.
