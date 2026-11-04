import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockDataService } from '../services/mock/mockDataService'
import { useToastStore } from './toastStore'

export const useInterventionStore = defineStore('intervention', () => {
  const toast = useToastStore()
  const filterOutcome = ref('ALL') // 'ALL' | 'Positive Response' | 'No Response' | 'In Progress' | 'Escalated'
  const filterTaId = ref('ALL')
  const filterRisk = ref('ALL')
  const searchQuery = ref('')

  // Modal states
  const showLogModal = ref(false)
  const activeStudentForModal = ref(null)

  const allInterventions = computed(() => {
    return mockDataService.getInterventions()
  })

  const filteredInterventions = computed(() => {
    let list = allInterventions.value

    if (filterOutcome.value !== 'ALL') {
      list = list.filter(i => i.outcome === filterOutcome.value)
    }

    if (filterTaId.value !== 'ALL') {
      list = list.filter(i => i.taId === filterTaId.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      list = list.filter(i => 
        i.studentName.toLowerCase().includes(q) ||
        i.rollNumber.toLowerCase().includes(q) ||
        i.taName.toLowerCase().includes(q) ||
        (i.notes && i.notes.toLowerCase().includes(q))
      )
    }

    return list
  })

  // Overdue follow-ups (>7 days since logged without positive/closed outcome)
  const overdueFollowUps = computed(() => {
    const now = Date.now()
    return allInterventions.value.filter(i => {
      if (i.status === 'Resolved') return false
      const daysOld = (now - new Date(i.date).getTime()) / (1000 * 3600 * 24)
      return daysOld > 7
    })
  })

  // Outcome statistics
  const outcomeStats = computed(() => {
    const list = allInterventions.value
    const total = list.length || 1
    const positive = list.filter(i => i.outcome === 'Positive Response').length
    const noResponse = list.filter(i => i.outcome === 'No Response').length
    const inProgress = list.filter(i => i.outcome === 'In Progress').length
    const escalated = list.filter(i => i.outcome === 'Escalated').length

    return {
      total: list.length,
      positive,
      positivePct: Math.round((positive / total) * 100),
      noResponse,
      noResponsePct: Math.round((noResponse / total) * 100),
      inProgress,
      inProgressPct: Math.round((inProgress / total) * 100),
      escalated,
      escalatedPct: Math.round((escalated / total) * 100)
    }
  })

  function openLogModal(student = null) {
    activeStudentForModal.value = student
    showLogModal.value = true
  }

  function closeLogModal() {
    showLogModal.value = false
    activeStudentForModal.value = null
  }

  function logIntervention(data) {
    const result = mockDataService.logIntervention(data)
    toast.success('Intervention recorded successfully!')
    closeLogModal()
    return result
  }

  function updateOutcome(interventionId, outcome, notes) {
    const result = mockDataService.updateInterventionOutcome(interventionId, outcome, notes)
    if (result) {
      toast.success('Intervention outcome updated.')
    }
    return result
  }

  function remindTa(interventionId) {
    const ok = mockDataService.remindTaForFollowUp(interventionId)
    if (ok) {
      toast.success('In-app follow-up reminder sent to TA.')
    }
  }

  return {
    filterOutcome,
    filterTaId,
    filterRisk,
    searchQuery,
    showLogModal,
    activeStudentForModal,
    allInterventions,
    filteredInterventions,
    overdueFollowUps,
    outcomeStats,
    openLogModal,
    closeLogModal,
    logIntervention,
    updateOutcome,
    remindTa
  }
})

