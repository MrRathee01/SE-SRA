import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockDataService } from '../services/mock/mockDataService'
import { storageService, StorageKeys } from '../services/mock/storageService'
import { useToastStore } from './toastStore'

export const useStudentStore = defineStore('student', () => {
  const toast = useToastStore()
  const student = ref(mockDataService.getStudentById('student-demo'))
  const courses = ref(mockDataService.courses)
  const showRiskDrawer = ref(false)
  const showPrerequisiteMap = ref(false)
  const showAdvisorModal = ref(false)

  // Notification preferences
  const notifPreferences = ref(
    storageService.getItem(StorageKeys.STUDENT_NOTIF_PREFS, {
      riskAlertsInApp: true,
      riskAlertsEmail: true,
      taUpdatesInApp: true,
      taUpdatesEmail: false,
      deadlinesInApp: true,
      deadlinesEmail: true,
      mentorshipInApp: true,
      mentorshipEmail: true
    })
  )

  function refreshStudent() {
    student.value = mockDataService.getStudentById('student-demo')
  }

  const assignedTa = computed(() => {
    if (!student.value || !student.value.assignedTaId) return null
    return mockDataService.getTaById(student.value.assignedTaId)
  })

  const mentorshipRequests = computed(() => {
    if (!student.value) return []
    return mockDataService.getMentorshipRequestsForStudent(student.value.id)
  })

  // Submit mentorship request
  function submitMentorshipRequest({ subject, description, urgency, courses: selectedCourses }) {
    if (!student.value) return false
    const newReq = mockDataService.createMentorshipRequest({
      studentId: student.value.id,
      subject,
      description,
      urgency,
      courses: selectedCourses
    })
    toast.success('Mentorship request submitted successfully! An advisor will respond shortly.')
    return newReq
  }

  // Update notification preferences
  function saveNotificationPreferences(newPrefs) {
    notifPreferences.value = { ...newPrefs }
    storageService.setItem(StorageKeys.STUDENT_NOTIF_PREFS, notifPreferences.value)
    toast.success('Notification preferences updated.')
  }

  // Course planner actions
  function registerCourseForNextTerm(courseCode) {
    toast.info(`Course registration intent for ${courseCode} recorded.`)
  }

  return {
    student,
    courses,
    assignedTa,
    showRiskDrawer,
    showPrerequisiteMap,
    showAdvisorModal,
    mentorshipRequests,
    notifPreferences,
    refreshStudent,
    submitMentorshipRequest,
    saveNotificationPreferences,
    registerCourseForNextTerm
  }
})

