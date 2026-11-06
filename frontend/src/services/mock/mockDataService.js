// Centralized Mock Data Service
// Simulates a future backend API layer, keeping UI components independent of data storage mechanics.
import { storageService, StorageKeys } from './storageService'
import {
  INITIAL_COURSES,
  INITIAL_TAS,
  INITIAL_STUDENTS,
  INITIAL_INTERVENTIONS,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_ACTIVITY_FEED,
  INITIAL_SETTINGS,
  EXCEL_REPEAT_COURSE_DATA
} from './initialData'

class MockDataService {
  constructor() {
    this.initData()
  }

  initData() {
    const storedStudents = storageService.getItem(StorageKeys.STUDENTS, INITIAL_STUDENTS)
    this.students = storedStudents.map(student => {
      const defaults = INITIAL_STUDENTS.find(item => item.id === student.id)
      return {
        ...defaults,
        ...student,
        skipTerms: Number.isFinite(Number(student.skipTerms))
          ? Number(student.skipTerms)
          : Number(defaults?.skipTerms) || 0,
        skipTermsHistory: Array.isArray(student.skipTermsHistory)
          ? student.skipTermsHistory
          : defaults?.skipTermsHistory || [],
        flagStatus: student.flagStatus === undefined
          ? defaults?.flagStatus || null
          : student.flagStatus
      }
    })
    const storedTas = storageService.getItem(StorageKeys.TAS, INITIAL_TAS)
    this.tas = storedTas.map(ta => {
      const defaults = INITIAL_TAS.find(item => item.id === ta.id)
      return {
        ...defaults,
        ...ta,
        schedulePreferences: ta.schedulePreferences || defaults?.schedulePreferences || null
      }
    })
    this.interventions = storageService.getItem(StorageKeys.INTERVENTIONS, INITIAL_INTERVENTIONS)
    this.mentorshipRequests = storageService.getItem(StorageKeys.MENTORSHIP_REQUESTS, INITIAL_MENTORSHIP_REQUESTS)
    this.notifications = storageService.getItem(StorageKeys.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
    const storedActivityFeed = storageService.getItem(StorageKeys.ACTIVITY_FEED, INITIAL_ADMIN_ACTIVITY_FEED)
    const seededFlagActivity = INITIAL_ADMIN_ACTIVITY_FEED.filter(activity => activity.type === 'FLAG_CHANGE')
    const storedActivityIds = new Set(storedActivityFeed.map(activity => activity.id))
    const missingSeedActivity = seededFlagActivity.filter(activity => !storedActivityIds.has(activity.id))
    this.activityFeed = [...storedActivityFeed, ...missingSeedActivity]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    if (missingSeedActivity.length) {
      storageService.setItem(StorageKeys.ACTIVITY_FEED, this.activityFeed)
    }
    this.settings = storageService.getItem(StorageKeys.SETTINGS, INITIAL_SETTINGS)
    this.taNotes = storageService.getItem(StorageKeys.TA_NOTES, {})
    this.courses = INITIAL_COURSES
    this.excelCourseData = EXCEL_REPEAT_COURSE_DATA
  }

  saveAll() {
    storageService.setItem(StorageKeys.STUDENTS, this.students)
    storageService.setItem(StorageKeys.TAS, this.tas)
    storageService.setItem(StorageKeys.INTERVENTIONS, this.interventions)
    storageService.setItem(StorageKeys.MENTORSHIP_REQUESTS, this.mentorshipRequests)
    storageService.setItem(StorageKeys.NOTIFICATIONS, this.notifications)
    storageService.setItem(StorageKeys.ACTIVITY_FEED, this.activityFeed)
    storageService.setItem(StorageKeys.SETTINGS, this.settings)
    storageService.setItem(StorageKeys.TA_NOTES, this.taNotes)
  }

  resetToDefaults() {
    storageService.clearAllPlatformData()
    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS))
    this.tas = JSON.parse(JSON.stringify(INITIAL_TAS))
    this.interventions = JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS))
    this.mentorshipRequests = JSON.parse(JSON.stringify(INITIAL_MENTORSHIP_REQUESTS))
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS))
    this.activityFeed = JSON.parse(JSON.stringify(INITIAL_ADMIN_ACTIVITY_FEED))
    this.settings = JSON.parse(JSON.stringify(INITIAL_SETTINGS))
    this.taNotes = {}
    this.saveAll()
    return true
  }

  // --- Students API ---
  getStudents() {
    return [...this.students]
  }

  getStudentById(id) {
    return this.students.find(s => s.id === id || s.rollNumber === id) || null
  }

  getStudentByEmail(email) {
    return this.students.find(s => s.email.toLowerCase() === email.toLowerCase()) || null
  }

  updateStudent(studentId, updates) {
    const idx = this.students.findIndex(s => s.id === studentId)
    if (idx !== -1) {
      this.students[idx] = { ...this.students[idx], ...updates }
      storageService.setItem(StorageKeys.STUDENTS, this.students)
      return this.students[idx]
    }
    return null
  }

  // --- TAs API ---
  getTas() {
    return [...this.tas]
  }

  getTaById(id) {
    return this.tas.find(t => t.id === id) || null
  }

  getTaByEmail(email) {
    return this.tas.find(t => t.email.toLowerCase() === email.toLowerCase()) || null
  }

  assignTaToStudent(studentId, taId, optionalMessage = '') {
    const student = this.getStudentById(studentId)
    const ta = this.getTaById(taId)
    if (!student || !ta) return false

    const previousTaId = student.assignedTaId
    student.assignedTaId = taId

    // Update TA stats
    ta.assignedCount += 1
    if (student.riskLevel !== 'Safe') {
      ta.atRiskCount += 1
    }

    if (previousTaId && previousTaId !== taId) {
      const prevTa = this.getTaById(previousTaId)
      if (prevTa && prevTa.assignedCount > 0) {
        prevTa.assignedCount -= 1
        if (student.riskLevel !== 'Safe' && prevTa.atRiskCount > 0) {
          prevTa.atRiskCount -= 1
        }
      }
    }

    // Add activity feed item
    const activityItem = {
      id: `act-${Date.now()}`,
      type: 'TA_ASSIGNMENT',
      message: `${ta.name} was assigned to ${student.name} (${student.rollNumber})`,
      timestamp: new Date().toISOString(),
      studentId: student.id,
      studentName: student.name
    }
    this.activityFeed.unshift(activityItem)

    // Notify Student
    this.createNotification({
      recipientType: 'STUDENT',
      recipientId: student.id,
      category: 'TA',
      title: 'Teaching Assistant Assigned',
      description: `${ta.name} has been assigned as your Teaching Assistant.${optionalMessage ? ` Note: "${optionalMessage}"` : ''}`,
      actionType: 'VIEW_TA',
      actionLabel: 'View TA Details'
    })

    // Notify TA
    this.createNotification({
      recipientType: 'TA',
      recipientId: ta.id,
      category: 'Academic',
      title: 'New Student Assigned',
      description: `${student.name} (${student.rollNumber}) has been assigned to you.${optionalMessage ? ` Admin Note: "${optionalMessage}"` : ''}`,
      actionType: 'VIEW_STUDENT',
      studentId: student.id,
      actionLabel: 'View Student Profile'
    })

    this.saveAll()
    return true
  }

  // --- Interventions API ---
  getInterventions() {
    return [...this.interventions]
  }

  getInterventionsForStudent(studentId) {
    return this.interventions.filter(i => i.studentId === studentId)
  }

  getInterventionsForTa(taId) {
    return this.interventions.filter(i => i.taId === taId)
  }

  logIntervention(interventionData) {
    const student = this.getStudentById(interventionData.studentId)
    const ta = this.getTaById(interventionData.taId)
    
    const newIntervention = {
      id: `int-${Date.now()}`,
      studentId: interventionData.studentId,
      studentName: student ? student.name : 'Unknown Student',
      rollNumber: student ? student.rollNumber : 'Unknown Roll',
      taId: interventionData.taId,
      taName: ta ? ta.name : 'Unknown TA',
      type: interventionData.type || 'One-on-one Session',
      date: interventionData.date || new Date().toISOString(),
      outcome: interventionData.outcome || 'In Progress',
      notes: interventionData.notes || '',
      followUpDue: interventionData.followUpDue || new Date(Date.now() + 7 * 86400000).toISOString(),
      status: interventionData.outcome === 'Positive Response' ? 'Resolved' : 'Pending'
    }

    this.interventions.unshift(newIntervention)

    // Log to activity feed
    this.activityFeed.unshift({
      id: `act-${Date.now()}`,
      type: 'INTERVENTION',
      message: `Intervention logged by ${newIntervention.taName} for ${newIntervention.studentName} (${newIntervention.outcome})`,
      timestamp: new Date().toISOString(),
      studentId: newIntervention.studentId,
      studentName: newIntervention.studentName
    })

    this.saveAll()
    return newIntervention
  }

  updateInterventionOutcome(interventionId, outcome, notes = '') {
    const item = this.interventions.find(i => i.id === interventionId)
    if (item) {
      item.outcome = outcome
      if (notes) item.notes = `${item.notes}\n[Update]: ${notes}`
      item.status = outcome === 'Positive Response' ? 'Resolved' : (outcome === 'Escalated' ? 'Escalated' : 'Pending')
      storageService.setItem(StorageKeys.INTERVENTIONS, this.interventions)
      return item
    }
    return null
  }

  remindTaForFollowUp(interventionId) {
    const item = this.interventions.find(i => i.id === interventionId)
    if (item) {
      this.createNotification({
        recipientType: 'TA',
        recipientId: item.taId,
        category: 'Intervention',
        title: 'Urgent: Follow-Up Reminder',
        description: `Follow-up outcome for intervention with ${item.studentName} is due. Please record the outcome.`,
        actionType: 'UPDATE_OUTCOME',
        interventionId: item.id,
        actionLabel: 'Update Outcome'
      })
      this.saveAll()
      return true
    }
    return false
  }

  // --- Mentorship Requests API ---
  getMentorshipRequests() {
    return [...this.mentorshipRequests]
  }

  getMentorshipRequestsForStudent(studentId) {
    return this.mentorshipRequests.filter(r => r.studentId === studentId)
  }

  createMentorshipRequest(data) {
    const student = this.getStudentById(data.studentId)
    const newRequest = {
      id: `mr-${Date.now()}`,
      studentId: data.studentId,
      studentName: student ? student.name : 'Unknown Student',
      rollNumber: student ? student.rollNumber : 'Unknown Roll',
      subject: data.subject,
      description: data.description,
      urgency: data.urgency || 'Normal',
      courses: data.courses || [],
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      adminResponse: null,
      routedTaId: null,
      isUnreadByAdmin: true
    }

    this.mentorshipRequests.unshift(newRequest)

    // Add activity
    this.activityFeed.unshift({
      id: `act-${Date.now()}`,
      type: 'MENTORSHIP',
      message: `New mentorship request submitted by ${newRequest.studentName} (${newRequest.subject})`,
      timestamp: new Date().toISOString(),
      studentId: newRequest.studentId,
      studentName: newRequest.studentName
    })

    this.saveAll()
    return newRequest
  }

  respondToMentorshipRequest(requestId, responseText, status = 'Actioned', routeToTaId = null) {
    const req = this.mentorshipRequests.find(r => r.id === requestId)
    if (!req) return false

    req.adminResponse = responseText
    req.status = status
    req.isUnreadByAdmin = false
    if (routeToTaId) {
      req.routedTaId = routeToTaId
      const ta = this.getTaById(routeToTaId)
      // Notify TA
      this.createNotification({
        recipientType: 'TA',
        recipientId: routeToTaId,
        category: 'System',
        title: 'Mentorship Request Assigned by Admin',
        description: `Admin assigned ${req.studentName}'s mentorship request on "${req.subject}" to you.`,
        actionType: 'VIEW_STUDENT',
        studentId: req.studentId,
        actionLabel: 'Review Request'
      })
    }

    // Notify Student
    this.createNotification({
      recipientType: 'STUDENT',
      recipientId: req.studentId,
      category: 'System',
      title: 'Update on Your Mentorship Request',
      description: `Your mentorship request regarding "${req.subject}" has been ${status.toLowerCase()}: "${responseText}"`,
      actionType: 'NAVIGATE',
      actionRoute: '/student/mentorship',
      actionLabel: 'View Details'
    })

    this.saveAll()
    return true
  }

  // --- Notifications API ---
  getNotifications(recipientType = null, recipientId = null) {
    return this.notifications.filter(n => {
      if (recipientType && n.recipientType !== recipientType) return false
      if (recipientId && n.recipientId !== recipientId) return false
      return true
    })
  }

  markNotificationAsRead(id) {
    const notif = this.notifications.find(n => n.id === id)
    if (notif) {
      notif.read = true
      storageService.setItem(StorageKeys.NOTIFICATIONS, this.notifications)
      return true
    }
    return false
  }

  deleteNotification(id) {
    const idx = this.notifications.findIndex(n => n.id === id)
    if (idx !== -1) {
      this.notifications.splice(idx, 1)
      storageService.setItem(StorageKeys.NOTIFICATIONS, this.notifications)
      return true
    }
    return false
  }

  markAllNotificationsAsRead(recipientType, recipientId) {
    this.notifications.forEach(n => {
      if (
        (!recipientType || n.recipientType === recipientType) &&
        (!recipientId || n.recipientId === recipientId)
      ) {
        n.read = true
      }
    })
    storageService.setItem(StorageKeys.NOTIFICATIONS, this.notifications)
    return true
  }

  createNotification(notifData) {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recipientType: notifData.recipientType || 'STUDENT',
      recipientId: notifData.recipientId,
      category: notifData.category || 'System',
      title: notifData.title,
      description: notifData.description,
      timestamp: notifData.timestamp || new Date().toISOString(),
      read: false,
      actionType: notifData.actionType || 'NONE',
      actionRoute: notifData.actionRoute || null,
      actionLabel: notifData.actionLabel || 'View',
      studentId: notifData.studentId || null,
      interventionId: notifData.interventionId || null
    }

    this.notifications.unshift(newNotif)
    storageService.setItem(StorageKeys.NOTIFICATIONS, this.notifications)
    return newNotif
  }

  sendBulkNotifications({ audience, title, message, category = 'System' }) {
    let targetStudents = []
    if (audience === 'ALL') {
      targetStudents = this.students
    } else if (audience === 'AT_RISK') {
      targetStudents = this.students.filter(s => s.riskLevel !== 'Safe')
    } else if (Array.isArray(audience)) {
      targetStudents = this.students.filter(s => audience.includes(s.id))
    }

    targetStudents.forEach(st => {
      const personalizedMessage = message
        .replace(/\{\{student_name\}\}/g, st.name)
        .replace(/\{\{risk_reason\}\}/g, st.riskFactors[0]?.factor || 'Academic check')
        .replace(/\{\{roll_number\}\}/g, st.rollNumber)

      this.createNotification({
        recipientType: 'STUDENT',
        recipientId: st.id,
        category,
        title,
        description: personalizedMessage,
        actionType: 'NAVIGATE',
        actionRoute: '/student/dashboard',
        actionLabel: 'Open Dashboard'
      })
    })

    return targetStudents.length
  }

  // --- Private TA Course Notes ---
  getTaCourseNote(studentId, courseCode) {
    const key = `${studentId}_${courseCode}`
    return this.taNotes[key] || ''
  }

  saveTaCourseNote(studentId, courseCode, note) {
    const key = `${studentId}_${courseCode}`
    this.taNotes[key] = note
    storageService.setItem(StorageKeys.TA_NOTES, this.taNotes)
    return true
  }

  // --- Admin Flagging API (Only Admins can set a student's risk tier) ---
  flagStudent(studentId, category, reason = '', adminName = 'Prof. Rajesh K. (Admin)') {
    const student = this.getStudentById(studentId)
    if (!student || !['Safe', 'At Risk', 'Critical'].includes(category)) return false
    if (category !== 'Safe' && !reason.trim()) return false

    const previousCategory = student.riskLevel
    const rationale = reason.trim() || 'Safe standing confirmed by Administration'
    student.flagStatus = {
      isFlagged: true,
      category,
      flaggedBy: adminName,
      flaggedAt: new Date().toISOString(),
      reason: rationale
    }
    student.riskLevel = category

    const action = previousCategory === category ? 'confirmed' : 'moved'
    this.activityFeed.unshift({
      id: `flag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'FLAG_CHANGE',
      message: `${adminName} ${action} ${student.name} from ${previousCategory || 'Unclassified'} to ${category}`,
      timestamp: student.flagStatus.flaggedAt,
      studentId: student.id,
      studentName: student.name,
      previousCategory,
      category,
      flaggedBy: adminName,
      reason: rationale
    })
    this.saveAll()
    return true
  }

  // --- TA Schedule Preferences API ---
  updateTaSchedule(taId, scheduleData) {
    const ta = this.getTaById(taId)
    if (!ta) return false
    ta.schedulePreferences = {
      ...ta.schedulePreferences,
      ...scheduleData,
      lastUpdated: new Date().toISOString()
    }
    storageService.setItem(StorageKeys.TAS, this.tas)
    return true
  }

  // --- Settings API ---
  getSettings() {
    return { ...this.settings }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings }
    storageService.setItem(StorageKeys.SETTINGS, this.settings)
    return this.settings
  }

  // --- Excel Course Analytics API ---
  getExcelBottleneckData() {
    return this.excelCourseData
  }

  getTopBottleneckCourses(limit = 5) {
    return [...this.excelCourseData]
      .sort((a, b) => b.total_repeats - a.total_repeats)
      .slice(0, limit)
  }
}

export const mockDataService = new MockDataService()
