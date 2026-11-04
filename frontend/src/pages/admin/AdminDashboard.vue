<template>
  <div class="space-y-6">
    <!-- Header with KPI Summary -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Program Administrator Birds-Eye Overview</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Program-wide risk diagnostics, progression milestone breach surveillance, and intervention funnel analytics.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button 
          type="button" 
          class="btn btn-secondary text-xs"
          @click="adminStore.exportStudentsToCsv"
        >
          <Download class="w-3.5 h-3.5 mr-1.5" />
          Export All Records (CSV)
        </button>
        <router-link to="/admin/students" class="btn btn-primary text-xs">
          Open Student Roster →
        </router-link>
      </div>
    </div>

    <!-- Row of 6 Top KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <StatCard 
        label="Total Active" 
        :value="adminStore.kpiStats.totalActive" 
        subtext="Enrolled Cohort"
        icon-name="Users"
        icon-bg-class="bg-navy-50"
        icon-color-class="text-navy-700"
        clickable
        @click="navigateToStudents('ALL')"
      />
      <StatCard 
        label="Critical (🔴)" 
        :value="adminStore.kpiStats.critical" 
        subtext="Severe Risk"
        icon-name="AlertOctagon"
        icon-bg-class="bg-rose-50"
        icon-color-class="text-rose-700"
        clickable
        @click="navigateToStudents('CRITICAL')"
      />
      <StatCard 
        label="At Risk (🟡)" 
        :value="adminStore.kpiStats.atRisk" 
        subtext="Milestone Lag"
        icon-name="AlertTriangle"
        icon-bg-class="bg-amber-50"
        icon-color-class="text-amber-700"
        clickable
        @click="navigateToStudents('AT_RISK')"
      />
      <StatCard 
        label="Safe (🟢)" 
        :value="adminStore.kpiStats.safe" 
        subtext="On-track Pace"
        icon-name="CheckCircle"
        icon-bg-class="bg-emerald-50"
        icon-color-class="text-emerald-700"
        clickable
        @click="navigateToStudents('SAFE')"
      />
      <StatCard 
        label="Total TAs" 
        :value="adminStore.kpiStats.totalTas" 
        subtext="Active Faculty TAs"
        icon-name="UserCheck"
        icon-bg-class="bg-blue-50"
        icon-color-class="text-blue-700"
        clickable
        @click="$router.push('/admin/tas')"
      />
      <StatCard 
        label="Open Interventions" 
        :value="adminStore.kpiStats.openInterventions" 
        subtext="Awaiting Resolution"
        icon-name="Clock"
        icon-bg-class="bg-purple-50"
        icon-color-class="text-purple-700"
        clickable
        @click="$router.push('/admin/interventions')"
      />
    </div>

    <!-- 2-Column: Risk Distribution Stacked Bar & Milestone Breach Tracker -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Risk Distribution Stacked Bar Chart with Filters -->
      <div class="card p-6 lg:col-span-2 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">Program Risk Distribution by Term</h3>
            <p class="text-xs text-slate-500 mt-0.5">Stacked breakdown of Safe vs At-Risk vs Critical students.</p>
          </div>

          <!-- Filters -->
          <div class="flex items-center gap-2">
            <select 
              v-model="chartFilterLevel"
              class="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="FOUNDATION">Foundation</option>
              <option value="DIPLOMA">Diploma</option>
            </select>
            <select 
              v-model="chartFilterCohort"
              class="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white focus:outline-none"
            >
              <option value="ALL">All Cohorts</option>
              <option value="Jan 2024">Jan 2024</option>
              <option value="May 2024">May 2024</option>
              <option value="Sep 2024">Sep 2024</option>
            </select>
          </div>
        </div>

        <div class="h-64">
          <StackedBarChart 
            :chart-data="stackedRiskData" 
            @bar-click="handleBarDrillDown"
          />
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Click any bar segment to drill down into matching student records.</span>
          <span class="font-semibold text-navy-700">Term 4 & 5 bottleneck detected</span>
        </div>
      </div>

      <!-- Milestone Breach Tracker Card -->
      <div class="card p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-slate-900">Milestone Breach Tracker</h3>
            <span class="badge badge-critical">Active Rules</span>
          </div>
          <p class="text-xs text-slate-500 mb-4">
            Real-time counts of students failing or approaching key progression checkpoints.
          </p>

          <div class="space-y-3">
            <!-- 4-in-4 breach -->
            <div 
              class="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 cursor-pointer transition-colors"
              @click="navigateToStudents('CRITICAL')"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-rose-900">Missed 4-in-4 Checkpoint</span>
                <span class="text-lg font-bold text-rose-700">{{ adminStore.milestoneBreachMetrics.missed4in4 }}</span>
              </div>
              <p class="text-[11px] text-rose-800 mt-1">Students completed &lt; 4 courses by Term 4 boundary.</p>
            </div>

            <!-- 6-in-6 breach -->
            <div 
              class="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors"
              @click="navigateToStudents('AT_RISK')"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-amber-900">Projected Miss: 6-in-6</span>
                <span class="text-lg font-bold text-amber-700">{{ adminStore.milestoneBreachMetrics.projectedMiss6in6 }}</span>
              </div>
              <p class="text-[11px] text-amber-800 mt-1">Approaching Term 6 with &lt; 6 courses completed.</p>
            </div>

            <!-- 8-in-9 warning -->
            <div 
              class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
              @click="navigateToStudents('AT_RISK')"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">At Risk of Not Completing 8-in-9</span>
                <span class="text-lg font-bold text-slate-900">{{ adminStore.milestoneBreachMetrics.atRisk8in9 }}</span>
              </div>
              <p class="text-[11px] text-slate-600 mt-1">Approaching final 9-term degree deadline.</p>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Click any card to view affected students.</span>
        </div>
      </div>
    </div>

    <!-- 2-Column: Intervention Funnel & Cohort Comparison Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Intervention Funnel -->
      <div class="card p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-slate-900">Intervention Funnel Pipeline</h3>
            <span class="badge badge-safe">Conversion Flow</span>
          </div>
          <p class="text-xs text-slate-500 mb-4">
            Monitoring progression from risk flagging to verified resolution and drop-off rates.
          </p>

          <FunnelChart :data="funnelData" />
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Drop-off between Intervention Done & Outcome: 14 students</span>
          <router-link to="/admin/interventions" class="font-semibold text-navy-700">
            Remind TAs →
          </router-link>
        </div>
      </div>

      <!-- Cohort Comparison Chart -->
      <div class="card p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-slate-900">Cohort Pacing Comparison</h3>
            <span class="text-xs text-slate-400">Intake Batches</span>
          </div>
          <p class="text-xs text-slate-500 mb-4">
            Average courses completed per term across Jan 2024, May 2024, and Sep 2024 cohorts.
          </p>

          <div class="h-60">
            <BarChart :chart-data="cohortPacingData" />
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Jan 2024 cohort pace: 1.4 courses/term</span>
          <span class="text-emerald-700 font-semibold">Sep 2024 tracking at 1.8</span>
        </div>
      </div>
    </div>

    <!-- Recent Program Activity Feed -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Program-Wide Activity Audit Stream</h3>
          <p class="text-xs text-slate-500 mt-0.5">Real-time log of risk status transitions, TA assignments, and mentorship dispatches.</p>
        </div>
        <router-link to="/admin/students" class="text-xs font-semibold text-navy-700">
          View All Students →
        </router-link>
      </div>

      <div class="space-y-3">
        <div 
          v-for="act in mockDataService.activityFeed.slice(0, 6)" 
          :key="act.id"
          class="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
        >
          <div class="flex items-center gap-3">
            <div 
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold',
                act.type === 'RISK_CHANGE' ? 'bg-amber-600' :
                act.type === 'MILESTONE_BREACH' ? 'bg-rose-600' :
                act.type === 'TA_ASSIGNMENT' ? 'bg-navy-700' : 'bg-blue-600'
              ]"
            >
              <Activity class="w-4 h-4" />
            </div>
            <div>
              <span class="font-semibold text-slate-900 block">{{ act.message }}</span>
              <span class="text-[11px] text-slate-400">{{ formatRelativeTime(act.timestamp) }}</span>
            </div>
          </div>

          <router-link 
            v-if="act.studentId" 
            :to="`/admin/students/${act.studentId}`"
            class="btn btn-secondary text-xs py-1 px-2.5 shrink-0"
          >
            Review Profile
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/adminStore'
import { mockDataService } from '../../services/mock/mockDataService'
import StatCard from '../../components/common/StatCard.vue'
import StackedBarChart from '../../components/charts/StackedBarChart.vue'
import BarChart from '../../components/charts/BarChart.vue'
import FunnelChart from '../../components/charts/FunnelChart.vue'
import { formatRelativeTime } from '../../utils/formatters'
import { Download, Activity } from 'lucide-vue-next'

const router = useRouter()
const adminStore = useAdminStore()

const chartFilterLevel = ref('ALL')
const chartFilterCohort = ref('ALL')

function navigateToStudents(riskTab) {
  adminStore.studentActiveTab = riskTab
  router.push('/admin/students')
}

function handleBarDrillDown({ datasetLabel }) {
  if (datasetLabel.includes('Critical')) navigateToStudents('CRITICAL')
  else if (datasetLabel.includes('At Risk')) navigateToStudents('AT_RISK')
  else navigateToStudents('SAFE')
}

// Stacked Bar Data
const stackedRiskData = computed(() => {
  return {
    labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5', 'Term 6', 'Term 7+'],
    datasets: [
      {
        label: 'Safe (🟢)',
        data: [45, 38, 29, 22, 18, 14, 10],
        backgroundColor: '#10b981',
        borderRadius: 4
      },
      {
        label: 'At Risk (🟡)',
        data: [6, 12, 18, 24, 21, 16, 9],
        backgroundColor: '#f59e0b',
        borderRadius: 4
      },
      {
        label: 'Critical (🔴)',
        data: [2, 4, 9, 15, 14, 11, 7],
        backgroundColor: '#ef4444',
        borderRadius: 4
      }
    ]
  }
})

// Funnel Data
const funnelData = {
  flagged: 120,
  assignedTa: 98,
  interventionDone: 82,
  outcomeLogged: 68,
  resolved: 54
}

// Cohort Pacing Comparison
const cohortPacingData = computed(() => {
  return {
    labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5'],
    datasets: [
      {
        label: 'Jan 2024 Batch',
        data: [1.8, 1.6, 1.4, 1.3, 1.5],
        backgroundColor: '#1e3757'
      },
      {
        label: 'May 2024 Batch',
        data: [1.9, 1.7, 1.5, 1.6, 1.7],
        backgroundColor: '#3b82f6'
      },
      {
        label: 'Sep 2024 Batch',
        data: [2.1, 1.9, 1.8, 1.7, 1.9],
        backgroundColor: '#10b981'
      }
    ]
  }
})
</script>

