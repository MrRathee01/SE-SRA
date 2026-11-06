<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700">Program overview</p>
        <h2 class="mt-1 text-3xl font-bold tracking-tight text-slate-900">Executive Dashboard</h2>
        <p class="mt-1 max-w-2xl text-sm text-slate-500">
          A calm, program-wide view of student success, current risk, and academic progress.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-secondary text-xs" @click="adminStore.exportStudentsToCsv">
          <Download class="mr-1.5 h-4 w-4" />
          Download report
        </button>
        <router-link to="/admin/students" class="btn btn-primary text-xs">Student directory</router-link>
      </div>
    </header>

    <section aria-label="Program summary" class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Students needing attention"
        :value="studentsNeedingAttention"
        :subtext="`${highPriorityStudentCount} high-priority`"
        icon-name="AlertOctagon"
        icon-bg-class="bg-rose-50"
        icon-color-class="text-rose-700"
      />
      <StatCard
        label="Positive intervention outcomes"
        :value="`${positiveOutcomeRate}%`"
        :subtext="`${positiveOutcomeCount} of ${completedOutcomeCount} recorded outcomes`"
        icon-name="HeartHandshake"
        icon-bg-class="bg-emerald-50"
        icon-color-class="text-emerald-700"
        clickable
        @click="$router.push('/admin/interventions')"
      />
      <StatCard
        label="Students on track"
        :value="`${onTrackRate}%`"
        :subtext="`${onTrackCount} in safe standing`"
        icon-name="CheckCircle"
        icon-bg-class="bg-green-50"
        icon-color-class="text-green-700"
        clickable
        @click="navigateToStudents('SAFE')"
      />
      <StatCard
        label="Active teaching assistants"
        :value="adminStore.kpiStats.totalTas"
        subtext="Teaching team"
        icon-name="UserCheck"
        icon-bg-class="bg-blue-50"
        icon-color-class="text-blue-700"
        clickable
        @click="$router.push('/admin/tas')"
      />
    </section>

    <section class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <article class="card p-5 sm:p-6">
        <div class="mb-3">
          <h3 class="font-bold text-slate-900">Risk distribution</h3>
          <p class="mt-1 text-xs text-slate-500">Current student standing. Select a segment to review that group.</p>
        </div>
        <div v-if="adminStore.kpiStats.totalActive" class="mx-auto h-64 max-w-lg">
          <DoughnutChart :chart-data="riskChartData" @segment-click="handleRiskSegment" />
        </div>
        <p v-else class="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No active students are available to summarize.</p>
      </article>

      <article class="card p-5 sm:p-6">
        <div class="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 class="font-bold text-slate-900">Academic progress</h3>
            <p class="mt-1 text-xs text-slate-500">Average recorded course scores by term across the cohort.</p>
          </div>
          <span class="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-800">
            {{ courseScoreCount }} course results
          </span>
        </div>
        <div v-if="academicProgressData.labels.length" class="h-64">
          <LineChart :chart-data="academicProgressData" :options="academicProgressOptions" />
        </div>
        <p v-else class="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No scored course history is available yet.</p>
      </article>
    </section>

    <section class="card p-5 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="font-semibold text-slate-900">Support at a glance</h3>
          <p class="mt-1 text-xs text-slate-500">
            {{ interventions.length }} recorded interventions, including {{ completedOutcomeCount }} with a final outcome.
          </p>
        </div>
        <router-link to="/admin/interventions" class="text-xs font-semibold text-navy-700 hover:text-navy-900">
          Review intervention tracking →
        </router-link>
      </div>
      <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-emerald-800">Positive response</p>
          <p class="mt-1 text-2xl font-bold text-emerald-900">{{ positiveOutcomeCount }}</p>
        </div>
        <div class="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-amber-800">No response</p>
          <p class="mt-1 text-2xl font-bold text-amber-900">{{ noResponseCount }}</p>
        </div>
        <div class="rounded-xl border border-rose-100 bg-rose-50/60 p-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-rose-800">Escalated</p>
          <p class="mt-1 text-2xl font-bold text-rose-900">{{ escalatedCount }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/adminStore'
import { mockDataService } from '../../services/mock/mockDataService'
import DoughnutChart from '../../components/charts/DoughnutChart.vue'
import LineChart from '../../components/charts/LineChart.vue'
import StatCard from '../../components/common/StatCard.vue'
import { Download } from 'lucide-vue-next'

const router = useRouter()
const adminStore = useAdminStore()

const activeStudents = computed(() => adminStore.allStudents.filter(student => student.status === 'ACTIVE'))
const studentsNeedingAttention = computed(() => activeStudents.value.filter(student => student.riskLevel !== 'Safe').length)
const highPriorityStudentCount = computed(() => activeStudents.value.filter(student => student.riskLevel === 'Critical').length)
const onTrackCount = computed(() => activeStudents.value.filter(student => student.riskLevel === 'Safe').length)
const onTrackRate = computed(() => activeStudents.value.length
  ? Math.round((onTrackCount.value / activeStudents.value.length) * 100)
  : 0)

const interventions = computed(() => mockDataService.getInterventions())
const interventionsWithFinalOutcome = computed(() => interventions.value.filter(intervention =>
  intervention.outcome && intervention.outcome !== 'In Progress'
))
const positiveOutcomeCount = computed(() => interventionsWithFinalOutcome.value
  .filter(intervention => intervention.outcome === 'Positive Response').length)
const completedOutcomeCount = computed(() => interventionsWithFinalOutcome.value.length)
const positiveOutcomeRate = computed(() => completedOutcomeCount.value
  ? Math.round((positiveOutcomeCount.value / completedOutcomeCount.value) * 100)
  : 0)
const noResponseCount = computed(() => interventions.value.filter(intervention => intervention.outcome === 'No Response').length)
const escalatedCount = computed(() => interventions.value.filter(intervention => intervention.outcome === 'Escalated').length)

const riskChartData = computed(() => ({
  labels: ['Safe', 'At risk', 'Critical'],
  datasets: [{
    data: [
      activeStudents.value.filter(student => student.riskLevel === 'Safe').length,
      activeStudents.value.filter(student => student.riskLevel === 'At Risk').length,
      activeStudents.value.filter(student => student.riskLevel === 'Critical').length
    ],
    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
    borderWidth: 0
  }]
}))

const courseScoresByTerm = computed(() => {
  const scores = new Map()
  for (const student of adminStore.allStudents) {
    for (const course of student.courseHistory || []) {
      if (course.score === null || course.score === undefined || course.score === '') continue
      const score = Number(course.score)
      const term = Number(course.termNumber)
      if (!Number.isFinite(score) || !Number.isInteger(term)) continue
      const entry = scores.get(term) || { total: 0, count: 0 }
      entry.total += score
      entry.count += 1
      scores.set(term, entry)
    }
  }
  return [...scores.entries()].sort(([termA], [termB]) => termA - termB)
})

const courseScoreCount = computed(() => courseScoresByTerm.value.reduce((sum, [, entry]) => sum + entry.count, 0))
const academicProgressData = computed(() => ({
  labels: courseScoresByTerm.value.map(([term]) => `Term ${term}`),
  datasets: [{
    label: 'Average course score',
    data: courseScoresByTerm.value.map(([, entry]) => Math.round(entry.total / entry.count)),
    borderColor: '#168f8b',
    backgroundColor: 'rgba(22, 143, 139, 0.12)',
    fill: true,
    tension: 0.35,
    pointRadius: 3,
    pointHoverRadius: 5
  }]
}))
const academicProgressOptions = {
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: { stepSize: 20 }
    }
  }
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
