import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockDataService } from '../services/mock/mockDataService'
import { useToastStore } from './toastStore'
import { exportToCsv } from '../utils/exportCsv'
import { useAuthStore } from './authStore'

export const useAdminStore = defineStore('admin', () => {
  const toast = useToastStore()
  const auth = useAuthStore()
  const dataVersion = ref(0)

  // Student Overview state
  const studentActiveTab = ref('ALL') // 'ALL' | 'CRITICAL' | 'AT_RISK' | 'SAFE'
  const studentSearchQuery = ref('')
  const filterLevel = ref('ALL')
  const filterTerm = ref('ALL')
  const filterCohort = ref('ALL')
  const filterAssignedTa = ref('ALL')
  const sortBy = ref('riskScore')
  const sortOrder = ref('desc')
  const selectedStudentIds = ref([])

  // TA Overview state
  const taSearchQuery = ref('')
  const taWorkloadThreshold = ref(22)

  // Mentorship Inbox state
  const mentorshipFilterStatus = ref('ALL') // 'ALL' | 'Pending' | 'Reviewed' | 'Actioned' | 'Closed'
  const selectedMentorshipRequest = ref(null)

  // TA Assignment Wizard modal state
  const isAssignmentWizardOpen = ref(false)
  const wizardTargetStudent = ref(null)
  const wizardStep = ref(1) // 1: Student summary, 2: TA select, 3: Optional message, 4: Confirm
  const wizardSelectedTaId = ref(null)
  const wizardMessage = ref('')

  // All students from mock data service
  const allStudents = computed(() => {
    dataVersion.value
    return mockDataService.getStudents()
  })

  // All TAs from mock data service
  const allTas = computed(() => {
    dataVersion.value
    return mockDataService.getTas()
  })

  function refreshData() {
    dataVersion.value += 1
  }

  // Program-wide KPI stats
  const kpiStats = computed(() => {
    const list = allStudents.value
    const totalActive = list.filter(s => s.status === 'ACTIVE').length
    const critical = list.filter(s => s.riskLevel === 'Critical').length
    const atRisk = list.filter(s => s.riskLevel === 'At Risk').length
    const safe = list.filter(s => s.riskLevel === 'Safe').length
    const totalTas = allTas.value.length
    const openInterventions = mockDataService.getInterventions()
      .filter(i => i.status === 'Pending' || i.status === 'Overdue').length

    return {
      totalActive,
      critical,
      atRisk,
      safe,
      totalTas,
      openInterventions
    }
  })

  const flaggedTierStats = computed(() => ({
    safe: allStudents.value.filter(student => student.riskLevel === 'Safe').length,
    atRisk: allStudents.value.filter(student => student.riskLevel === 'At Risk').length,
    critical: allStudents.value.filter(student => student.riskLevel === 'Critical').length
  }))

  const priorityFlaggedStudents = computed(() => allStudents.value
    .filter(student =>
      student.flagStatus?.isFlagged &&
      ['Critical', 'At Risk'].includes(student.flagStatus.category)
    )
    .sort((a, b) => new Date(b.flagStatus.flaggedAt || 0) - new Date(a.flagStatus.flaggedAt || 0)))

  const recentFlagActivity = computed(() => {
    dataVersion.value
    return mockDataService.activityFeed.filter(activity => activity.type === 'FLAG_CHANGE').slice(0, 5)
  })

  // Milestone breach metrics
  const milestoneBreachMetrics = computed(() => {
    const list = allStudents.value
    const missed4in4 = list.filter(s => s.checkpoints?.fourInFour?.status === 'MISSED').length
    const projectedMiss6in6 = list.filter(s => 
      s.checkpoints?.sixInSix?.status === 'APPROACHING' || s.checkpoints?.sixInSix?.status === 'MISSED'
    ).length
    const atRisk8in9 = list.filter(s => 
      s.checkpoints?.eightInNine?.status === 'WARNING' || s.checkpoints?.eightInNine?.status === 'CRITICAL'
    ).length

    return {
      missed4in4,
      projectedMiss6in6,
      atRisk8in9
    }
  })

  // Filtered and sorted students for Student Overview
  const filteredStudents = computed(() => {
    let list = [...allStudents.value]

    // Tab filter
    if (studentActiveTab.value === 'CRITICAL') {
      list = list.filter(s => s.riskLevel === 'Critical')
    } else if (studentActiveTab.value === 'AT_RISK') {
      list = list.filter(s => s.riskLevel === 'At Risk')
    } else if (studentActiveTab.value === 'SAFE') {
      list = list.filter(s => s.riskLevel === 'Safe')
    }

    // Search query
    if (studentSearchQuery.value.trim()) {
      const q = studentSearchQuery.value.toLowerCase()
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      )
    }

    // Level filter
    if (filterLevel.value !== 'ALL') {
      list = list.filter(s => s.currentLevel === filterLevel.value)
    }

    // Term filter
    if (filterTerm.value !== 'ALL') {
      list = list.filter(s => s.termNumber === Number(filterTerm.value))
    }

    // Assigned TA filter
    if (filterAssignedTa.value !== 'ALL') {
      list = list.filter(s => s.assignedTaId === filterAssignedTa.value)
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortBy.value]
      let valB = b[sortBy.value]

      if (typeof valA === 'string') {
        valA = valA.toLowerCase()
        valB = (valB || '').toLowerCase()
      }

      if (sortOrder.value === 'asc') {
        return valA > valB ? 1 : -1
      } else {
        return valA < valB ? 1 : -1
      }
    })

    return list
  })

  // TA Overview filtered list
  const filteredTas = computed(() => {
    let list = [...allTas.value]
    if (taSearchQuery.value.trim()) {
      const q = taSearchQuery.value.toLowerCase()
      list = list.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.expertise.some(e => e.toLowerCase().includes(q))
      )
    }
    return list
  })

  // Repeat course offenders list (students who have repeat attempts)
  const repeatOffenders = computed(() => {
    let result = []
    allStudents.value.forEach(s => {
      if (s.courseHistory) {
        s.courseHistory.forEach(c => {
          if (c.attempts > 1) {
            const ta = mockDataService.getTaById(s.assignedTaId)
            const studentInterventions = mockDataService.getInterventionsForStudent(s.id)
            const lastInt = studentInterventions[0] || null

            result.push({
              id: `${s.id}_${c.courseCode}_${c.attempts}`,
              studentId: s.id,
              studentName: s.name,
              rollNumber: s.rollNumber,
              courseCode: c.courseCode,
              courseName: c.courseName,
              attempts: c.attempts,
              latestScore: c.score || 'In Progress',
              riskLevel: s.riskLevel,
              taAssigned: ta ? ta.name : 'Unassigned',
              lastIntervention: lastInt ? lastInt.type : 'None'
            })
          }
        })
      }
    })
    return result
  })

  // Top repeated courses from actual Excel workbook
  const topBottleneckCourses = computed(() => {
    return mockDataService.getTopBottleneckCourses(6)
  })

  // Mentorship Requests Inbox filtered list
  const filteredMentorshipRequests = computed(() => {
    let list = mockDataService.getMentorshipRequests()
    if (mentorshipFilterStatus.value !== 'ALL') {
      list = list.filter(r => r.status === mentorshipFilterStatus.value)
    }
    return list
  })

  // Bulk student actions
  function toggleSelectStudent(id) {
    if (selectedStudentIds.value.includes(id)) {
      selectedStudentIds.value = selectedStudentIds.value.filter(sId => sId !== id)
    } else {
      selectedStudentIds.value.push(id)
    }
  }

  function selectAllStudents(ids = filteredStudents.value.map(student => student.id)) {
    const allSelected = ids.length > 0 && ids.every(id => selectedStudentIds.value.includes(id))
    if (allSelected) {
      selectedStudentIds.value = selectedStudentIds.value.filter(id => !ids.includes(id))
    } else {
      selectedStudentIds.value = [...new Set([...selectedStudentIds.value, ...ids])]
    }
  }

  function exportStudentsToCsv() {
    const dataToExport = filteredStudents.value.map(s => ({
      'Roll Number': s.rollNumber,
      'Full Name': s.name,
      'Email': s.studentEmail,
      'Program': s.program,
      'Level': s.currentLevel,
      'Term': s.termNumber,
      'Risk Status': s.riskLevel,
      'Risk Score': s.riskScore,
      'Foundation Courses Completed': s.foundationCompleted,
      'Assigned TA': mockDataService.getTaById(s.assignedTaId)?.name || 'Unassigned',
      'Status': s.status
    }))
    exportToCsv(dataToExport, `IITM_Students_Export_${new Date().toISOString().slice(0, 10)}.csv`)
    toast.success(`Exported ${dataToExport.length} students to CSV.`)
  }

  // TA Assignment Wizard flow
  function openAssignmentWizard(student) {
    wizardTargetStudent.value = student
    wizardStep.value = 1
    // Pick recommended TA based on lowest load & matching expertise
    const sortedTas = [...allTas.value].sort((a, b) => a.assignedCount - b.assignedCount)
    wizardSelectedTaId.value = sortedTas[0]?.id || 'ta-1'
    wizardMessage.value = `Please mentor ${student.name} (${student.rollNumber}) regarding their academic standing and upcoming milestone requirements.`
    isAssignmentWizardOpen.value = true
  }

  function closeAssignmentWizard() {
    isAssignmentWizardOpen.value = false
    wizardTargetStudent.value = null
    wizardStep.value = 1
    wizardSelectedTaId.value = null
    wizardMessage.value = ''
  }

  function confirmAssignment() {
    if (!wizardTargetStudent.value || !wizardSelectedTaId.value) return
    const success = mockDataService.assignTaToStudent(
      wizardTargetStudent.value.id,
      wizardSelectedTaId.value,
      wizardMessage.value
    )
    if (success) {
      toast.success(`TA assigned successfully to ${wizardTargetStudent.value.name}!`)
      refreshData()
      closeAssignmentWizard()
    }
  }

  function flagStudent(studentId, category, reason = '') {
    if (!auth.isAdmin) {
      toast.error('Only administrators can change a student risk tier.')
      return false
    }

    if (!['Safe', 'At Risk', 'Critical'].includes(category)) {
      toast.error('Select a valid student risk tier.')
      return false
    }

    if (category !== 'Safe' && !reason.trim()) {
      toast.error('A rationale is required for At Risk and Critical classifications.')
      return false
    }

    const success = mockDataService.flagStudent(
      studentId,
      category,
      reason,
      auth.currentUser?.name || 'Administrator'
    )
    if (success) {
      toast.success(`Student tier updated to ${category}.`)
      refreshData()
    } else {
      toast.error('The student risk tier could not be updated.')
    }
    return success
  }

  return {
    studentActiveTab,
    studentSearchQuery,
    filterLevel,
    filterTerm,
    filterCohort,
    filterAssignedTa,
    sortBy,
    sortOrder,
    selectedStudentIds,
    taSearchQuery,
    taWorkloadThreshold,
    mentorshipFilterStatus,
    selectedMentorshipRequest,
    isAssignmentWizardOpen,
    wizardTargetStudent,
    wizardStep,
    wizardSelectedTaId,
    wizardMessage,
    allStudents,
    allTas,
    refreshData,
    kpiStats,
    flaggedTierStats,
    priorityFlaggedStudents,
    recentFlagActivity,
    milestoneBreachMetrics,
    filteredStudents,
    filteredTas,
    repeatOffenders,
    topBottleneckCourses,
    filteredMentorshipRequests,
    toggleSelectStudent,
    selectAllStudents,
    exportStudentsToCsv,
    openAssignmentWizard,
    closeAssignmentWizard,
    confirmAssignment,
    flagStudent
  }
})
