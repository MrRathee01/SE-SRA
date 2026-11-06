<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700">Risk & intervention</p>
        <h2 class="mt-1 text-2xl font-bold tracking-tight text-slate-900">Flagged students and support</h2>
        <p class="mt-1 text-sm text-slate-500">Review priority classifications, recent changes, and support capacity.</p>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn btn-secondary text-xs" @click="adminStore.exportStudentsToCsv">
          <Download class="mr-1.5 h-4 w-4" />
          Export records
        </button>
        <router-link to="/admin/students" class="btn btn-primary text-xs">Student directory</router-link>
      </div>
    </div>

    <section class="card space-y-5 p-5 sm:p-6">
      <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 class="font-bold text-slate-900">Flagged students</h3>
          <p class="mt-1 text-xs text-slate-500">Each student has one current tier. Review recent priority classifications and changes.</p>
        </div>
        <router-link to="/admin/students" class="text-xs font-semibold text-navy-700 hover:text-navy-900">View all students →</router-link>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button type="button" class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-left transition hover:bg-emerald-50" @click="navigateToStudents('SAFE')">
          <span class="text-xs font-semibold uppercase tracking-wider text-emerald-800">Safe</span>
          <span class="mt-1 block text-2xl font-bold text-emerald-900">{{ adminStore.flaggedTierStats.safe }}</span>
          <span class="mt-1 block text-[11px] text-emerald-700">Safe standing →</span>
        </button>
        <button type="button" class="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-left transition hover:bg-amber-50" @click="navigateToStudents('AT_RISK')">
          <span class="text-xs font-semibold uppercase tracking-wider text-amber-800">At Risk</span>
          <span class="mt-1 block text-2xl font-bold text-amber-900">{{ adminStore.flaggedTierStats.atRisk }}</span>
          <span class="mt-1 block text-[11px] text-amber-700">Watchlist →</span>
        </button>
        <button type="button" class="rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-left transition hover:bg-rose-50" @click="navigateToStudents('CRITICAL')">
          <span class="text-xs font-semibold uppercase tracking-wider text-rose-800">Critical</span>
          <span class="mt-1 block text-2xl font-bold text-rose-900">{{ adminStore.flaggedTierStats.critical }}</span>
          <span class="mt-1 block text-[11px] text-rose-700">Intervention required →</span>
        </button>
      </div>

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div>
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <h4 class="text-sm font-semibold text-slate-800">Priority review</h4>
              <p class="mt-0.5 text-[11px] text-slate-500">Showing {{ Math.min(priorityFlaggedStudents.length, 5) }} of {{ priorityFlaggedStudents.length }} priority students</p>
            </div>
            <router-link to="/admin/students" class="shrink-0 text-xs font-medium text-navy-700 hover:text-navy-900">View directory →</router-link>
          </div>
          <div v-if="priorityFlaggedStudents.length" class="divide-y divide-slate-100">
            <div v-for="student in priorityFlaggedStudents.slice(0, 5)" :key="student.id" class="flex items-start justify-between gap-3 py-3 first:pt-0">
              <div class="min-w-0">
                <router-link :to="`/admin/students/${student.id}`" class="truncate text-sm font-semibold text-navy-800 hover:underline">{{ student.name }}</router-link>
                <p class="mt-1 truncate text-xs text-slate-600">{{ student.flagStatus.reason }}</p>
                <p class="mt-1 text-[11px] text-slate-400">Flagged by {{ student.flagStatus.flaggedBy }} · {{ formatDate(student.flagStatus.flaggedAt) }}</p>
              </div>
              <RiskBadge :level="student.riskLevel" />
            </div>
          </div>
          <p v-else class="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">No Critical or At Risk students have been administratively flagged.</p>
        </div>

        <div>
          <h4 class="mb-3 text-sm font-semibold text-slate-800">Recent flag activity <span class="font-normal text-slate-400">(latest 5)</span></h4>
          <div v-if="adminStore.recentFlagActivity.length" class="space-y-2">
            <div v-for="activity in adminStore.recentFlagActivity" :key="activity.id" class="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
              <p class="text-xs font-semibold leading-relaxed text-slate-700">{{ activity.message }}</p>
              <p class="mt-1 text-[11px] text-slate-500">{{ formatDate(activity.timestamp) }}</p>
              <p v-if="activity.reason" class="mt-1 truncate text-[11px] text-slate-400" :title="activity.reason">
                {{ activity.reason }}
              </p>
            </div>
          </div>
          <p v-else class="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">New administrative tier changes will appear here.</p>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <section class="card p-5 sm:p-6">
        <div class="mb-4">
          <h3 class="font-bold text-slate-900">Cohort risk distribution</h3>
          <p class="mt-1 text-xs text-slate-500">Students by current standing. Select a segment to review that group.</p>
        </div>
        <div class="mx-auto h-64 max-w-lg">
          <DoughnutChart :chart-data="riskChartData" @segment-click="handleRiskSegment" />
        </div>
      </section>

      <section class="card p-5 sm:p-6">
        <div class="mb-4">
          <h3 class="font-bold text-slate-900">Milestone pacing health</h3>
          <p class="mt-1 text-xs text-slate-500">Share of active students meeting each progression checkpoint.</p>
        </div>
        <div class="space-y-5">
          <div v-for="checkpoint in pacingHealth" :key="checkpoint.name">
            <div class="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span class="font-medium text-slate-700">{{ checkpoint.name }}</span>
              <span class="font-semibold text-slate-900">{{ checkpoint.rate }}% <span class="text-xs font-normal text-slate-400">({{ checkpoint.met }}/{{ checkpoint.total }})</span></span>
            </div>
            <div class="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-navy-700 transition-all" :style="{ width: `${checkpoint.rate}%` }"></div>
            </div>
            <p class="mt-1 text-[11px] text-slate-400">{{ checkpoint.attention }} students need attention</p>
          </div>
        </div>
      </section>

      <section class="card p-5 sm:p-6">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 class="font-bold text-slate-900">Intervention pipeline</h3>
            <p class="mt-1 text-xs text-slate-500">From risk identification through resolved support.</p>
          </div>
          <router-link to="/admin/interventions" class="text-xs font-semibold text-navy-700 hover:text-navy-900">Review queue</router-link>
        </div>
        <FunnelChart :data="pipelineData" />
      </section>

      <section class="card p-5 sm:p-6">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 class="font-bold text-slate-900">TA caseload & capacity</h3>
            <p class="mt-1 text-xs text-slate-500">Highest-utilization TAs. Showing {{ capacityPreview.length }} of {{ adminStore.allTas.length }}.</p>
          </div>
          <router-link to="/admin/tas" class="shrink-0 text-xs font-semibold text-navy-700 hover:text-navy-900">Manage TAs</router-link>
        </div>
        <div class="space-y-3">
          <div v-for="ta in capacityPreview" :key="ta.id" class="rounded-xl border border-slate-100 p-3">
            <div class="mb-2 flex items-center justify-between gap-3">
              <span class="truncate text-sm font-medium text-slate-800">{{ ta.name }}</span>
              <span class="shrink-0 text-xs font-semibold text-slate-600">{{ ta.assignedCount }} / {{ ta.maxCapacity || 25 }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full" :class="capacityClass(ta)" :style="{ width: `${capacityPercent(ta)}%` }"></div>
            </div>
          </div>
          <p v-if="capacityPreview.length === 0" class="py-6 text-center text-sm text-slate-400">No teaching assistants are registered.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/adminStore'
import DoughnutChart from '../../components/charts/DoughnutChart.vue'
import FunnelChart from '../../components/charts/FunnelChart.vue'
import { Download } from 'lucide-vue-next'
import { mockDataService } from '../../services/mock/mockDataService'
import RiskBadge from '../../components/common/RiskBadge.vue'
import { formatDate } from '../../utils/formatters'

const router = useRouter()
const adminStore = useAdminStore()
const priorityFlaggedStudents = computed(() => adminStore.priorityFlaggedStudents)

const riskChartData = computed(() => ({
  labels: ['Safe', 'At risk', 'Critical'],
  datasets: [{
    data: [adminStore.kpiStats.safe, adminStore.kpiStats.atRisk, adminStore.kpiStats.critical],
    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
    borderWidth: 0
  }]
}))

const pacingHealth = computed(() => {
  const checkpoints = [
    { name: '4-in-4', key: 'fourInFour' },
    { name: '6-in-6', key: 'sixInSix' },
    { name: '8-in-9', key: 'eightInNine' }
  ]
  const students = adminStore.allStudents.filter(student => student.status === 'ACTIVE')

  return checkpoints.map(checkpoint => {
    const met = students.filter(student => student.checkpoints?.[checkpoint.key]?.status === 'MET').length
    const total = students.length
    return {
      name: checkpoint.name,
      met,
      total,
      rate: total ? Math.round((met / total) * 100) : 0,
      attention: total - met
    }
  })
})

const pipelineData = computed(() => {
  const flagged = adminStore.allStudents.filter(student => student.riskLevel !== 'Safe' || student.flagStatus?.isFlagged)
  const assignedTa = flagged.filter(student => student.assignedTaId)
  const withInterventions = assignedTa.filter(student => mockDataService.getInterventionsForStudent(student.id).length > 0)
  const outcomes = withInterventions.filter(student => mockDataService.getInterventionsForStudent(student.id).some(item => item.outcome && item.outcome !== 'In Progress'))
  const resolved = outcomes.filter(student => mockDataService.getInterventionsForStudent(student.id).some(item => item.status === 'Resolved'))
  return {
    flagged: flagged.length,
    assignedTa: assignedTa.length,
    interventionDone: withInterventions.length,
    outcomeLogged: outcomes.length,
    resolved: resolved.length
  }
})

const capacityPreview = computed(() => [...adminStore.allTas]
  .sort((a, b) => capacityPercent(b) - capacityPercent(a))
  .slice(0, 4))

function capacityPercent(ta) {
  return Math.min(100, Math.round((ta.assignedCount / (ta.maxCapacity || 25)) * 100))
}

function capacityClass(ta) {
  const percent = capacityPercent(ta)
  if (percent >= 100) return 'bg-rose-500'
  if (percent >= 80) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function navigateToStudents(tab) {
  adminStore.studentActiveTab = tab
  router.push('/admin/students')
}

function handleRiskSegment({ label }) {
  const tabs = { Critical: 'CRITICAL', 'At risk': 'AT_RISK', Safe: 'SAFE' }
  navigateToStudents(tabs[label] || 'ALL')
}
</script>
