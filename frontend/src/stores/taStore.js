import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockDataService } from '../services/mock/mockDataService'
import { useToastStore } from './toastStore'

export const useTaStore = defineStore('ta', () => {
  const toast = useToastStore()
  const currentTaId = ref('ta-1')
  const viewMode = ref('table') // 'table' | 'cards'
  const activeTab = ref('stats') // 'stats' | 'students'
  const studentSearchQuery = ref('')
  const riskFilter = ref('ALL') // 'ALL' | 'CRITICAL' | 'AT_RISK' | 'SAFE'
  const termFilter = ref('ALL')
  const selectedStudentIds = ref([])
  const onlyAtRiskDeadlines = ref(false)

  const taProfile = computed(() => {
    return mockDataService.getTaById(currentTaId.value)
  })

  const assignedStudents = computed(() => {
    return mockDataService.getStudents().filter(s => s.assignedTaId === currentTaId.value)
  })

  const filteredAssignedStudents = computed(() => {
    let list = assignedStudents.value

    if (studentSearchQuery.value.trim()) {
      const q = studentSearchQuery.value.toLowerCase()
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.rollNumber.toLowerCase().includes(q)
      )
    }

    if (riskFilter.value !== 'ALL') {
      if (riskFilter.value === 'CRITICAL') {
        list = list.filter(s => s.riskLevel === 'Critical')
      } else if (riskFilter.value === 'AT_RISK') {
        list = list.filter(s => s.riskLevel === 'At Risk')
      } else if (riskFilter.value === 'SAFE') {
        list = list.filter(s => s.riskLevel === 'Safe')
      }
    }

    if (termFilter.value !== 'ALL') {
      list = list.filter(s => s.termNumber === Number(termFilter.value))
    }

    return list
  })

  // TA summary metrics
  const stats = computed(() => {
    const list = assignedStudents.value
    const critical = list.filter(s => s.riskLevel === 'Critical').length
    const atRisk = list.filter(s => s.riskLevel === 'At Risk').length
    const safe = list.filter(s => s.riskLevel === 'Safe').length
    const pendingInterventions = mockDataService.getInterventionsForTa(currentTaId.value)
      .filter(i => i.status === 'Pending' || i.status === 'Overdue').length

    return {
      totalAssigned: list.length,
      critical,
      atRisk,
      safe,
      pendingInterventions
    }
  })

  // Aggregated upcoming deadlines for assigned students
  const aggregatedDeadlines = computed(() => {
    let deadlines = []
    assignedStudents.value.forEach(s => {
      if (onlyAtRiskDeadlines.value && s.riskLevel === 'Safe') return
      if (s.upcomingDeadlines) {
        s.upcomingDeadlines.forEach(dl => {
          deadlines.push({
            ...dl,
            studentName: s.name,
            rollNumber: s.rollNumber,
            studentRisk: s.riskLevel,
            studentId: s.id
          })
        })
      }
    })
    return deadlines.sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
  })

  // Activity feed for TA
  const activityFeed = computed(() => {
    const assignedIds = new Set(assignedStudents.value.map(s => s.id))
    return mockDataService.activityFeed.filter(a => !a.studentId || assignedIds.has(a.studentId))
  })

  function toggleSelectStudent(id) {
    if (selectedStudentIds.value.includes(id)) {
      selectedStudentIds.value = selectedStudentIds.value.filter(sId => sId !== id)
    } else {
      selectedStudentIds.value.push(id)
    }
  }

  function selectAllFiltered() {
    if (selectedStudentIds.value.length === filteredAssignedStudents.value.length) {
      selectedStudentIds.value = []
    } else {
      selectedStudentIds.value = filteredAssignedStudents.value.map(s => s.id)
    }
  }

  function flagSelectedForAdminReview() {
    if (!selectedStudentIds.value.length) return
    selectedStudentIds.value.forEach(id => {
      const student = mockDataService.getStudentById(id)
      if (student) {
        mockDataService.activityFeed.unshift({
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: 'FLAG_ADMIN',
          message: `TA flagged ${student.name} (${student.rollNumber}) for Admin academic review`,
          timestamp: new Date().toISOString(),
          studentId: student.id,
          studentName: student.name
        })
      }
    })
    toast.success(`Flagged ${selectedStudentIds.value.length} student(s) for Admin review.`)
    selectedStudentIds.value = []
  }

  function sendBulkNotification(message) {
    if (!selectedStudentIds.value.length) return
    const count = mockDataService.sendBulkNotifications({
      audience: selectedStudentIds.value,
      title: 'Note from your Teaching Assistant',
      message: message || 'Please reach out during TA doubt-clearing hours regarding your course progress.',
      category: 'TA'
    })
    toast.success(`Notification sent to ${count} student(s).`)
    selectedStudentIds.value = []
  }

  function getCourseNote(studentId, courseCode) {
    return mockDataService.getTaCourseNote(studentId, courseCode)
  }

  function saveCourseNote(studentId, courseCode, note) {
    mockDataService.saveTaCourseNote(studentId, courseCode, note)
    toast.success('Private course note saved.')
  }

  return {
    currentTaId,
    viewMode,
    activeTab,
    studentSearchQuery,
    riskFilter,
    termFilter,
    selectedStudentIds,
    onlyAtRiskDeadlines,
    taProfile,
    assignedStudents,
    filteredAssignedStudents,
    stats,
    aggregatedDeadlines,
    activityFeed,
    toggleSelectStudent,
    selectAllFiltered,
    flagSelectedForAdminReview,
    sendBulkNotification,
    getCourseNote,
    saveCourseNote
  }
})

