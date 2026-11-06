<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <h2 class="text-xl font-bold text-slate-900">{{ taStore.taProfile?.name || 'TA Portal' }}</h2>
          <span class="badge badge-safe">Senior Teaching Assistant</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          {{ taStore.taProfile?.department }} • Workload: {{ taStore.stats.totalAssigned }} assigned students ({{ taStore.stats.critical + taStore.stats.atRisk }} require intervention)
        </p>
      </div>

      <!-- Tab Switcher (General Stats vs Student Overview) -->
      <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          type="button"
          :class="[
            'px-4 py-1.5 text-xs font-bold rounded-lg transition-all',
            taStore.activeTab === 'stats' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="taStore.activeTab = 'stats'"
        >
          General Stats
        </button>
        <button
          type="button"
          :class="[
            'px-4 py-1.5 text-xs font-bold rounded-lg transition-all',
            taStore.activeTab === 'students' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="taStore.activeTab = 'students'"
        >
          Assigned Students ({{ taStore.assignedStudents.length }})
        </button>
      </div>
    </div>

    <!-- ================= TAB 1: GENERAL STATS ================= -->
    <div v-if="taStore.activeTab === 'stats'" class="space-y-6">
      <!-- Summary KPI Row -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard 
          label="Total Assigned" 
          :value="taStore.stats.totalAssigned" 
          subtext="Under TA Mentorship"
          icon-name="Users"
          icon-bg-class="bg-navy-50"
          icon-color-class="text-navy-700"
          clickable
          @click="goToTabWithFilter('ALL')"
        />
        <StatCard 
          label="Critical Risk (🔴)" 
          :value="taStore.stats.critical" 
          subtext="Immediate action"
          icon-name="AlertOctagon"
          icon-bg-class="bg-rose-50"
          icon-color-class="text-rose-700"
          clickable
          @click="goToTabWithFilter('CRITICAL')"
        />
        <StatCard 
          label="At Risk (🟡)" 
          :value="taStore.stats.atRisk" 
          subtext="Progression warning"
          icon-name="AlertTriangle"
          icon-bg-class="bg-amber-50"
          icon-color-class="text-amber-700"
          clickable
          @click="goToTabWithFilter('AT_RISK')"
        />
        <StatCard 
          label="Safe Standing (🟢)" 
          :value="taStore.stats.safe" 
          subtext="On-track pace"
          icon-name="CheckCircle"
          icon-bg-class="bg-emerald-50"
          icon-color-class="text-emerald-700"
          clickable
          @click="goToTabWithFilter('SAFE')"
        />
        <StatCard 
          label="Pending Interventions" 
          :value="taStore.stats.pendingInterventions" 
          subtext="Awaiting outcome"
          icon-name="Clock"
          icon-bg-class="bg-blue-50"
          icon-color-class="text-blue-700"
        />
      </div>

      <!-- 2-Column: Risk Distribution Chart & Activity Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Risk Distribution Doughnut Chart -->
        <div class="card p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-bold text-slate-900">Risk Distribution</h3>
              <span class="text-xs text-slate-400 font-medium">Click slice to filter</span>
            </div>
            <p class="text-xs text-slate-500 mb-4">
              Breakdown of your assigned students by academic standing.
            </p>

            <div class="h-56">
              <DoughnutChart 
                :chart-data="riskDonutData" 
                @segment-click="handleChartSegmentClick"
              />
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Critical & At Risk: {{ Math.round(((taStore.stats.critical + taStore.stats.atRisk) / (taStore.stats.totalAssigned || 1)) * 100) }}%</span>
            <button 
              type="button" 
              class="font-semibold text-navy-700 hover:text-navy-900"
              @click="goToTabWithFilter('AT_RISK')"
            >
              Filter At-Risk Students →
            </button>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-bold text-slate-900">Student Activity Feed</h3>
              <span class="text-xs text-slate-400">Live academic events</span>
            </div>
            <p class="text-xs text-slate-500 mb-4">
              Recent events, missed homework, risk upgrades, and intervention logs for your assigned cohort.
            </p>

            <div class="space-y-3">
              <div 
                v-for="act in taStore.activityFeed.slice(0, 5)" 
                :key="act.id"
                class="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-navy-100 text-navy-800 shrink-0">
                    <Activity class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="font-semibold text-slate-800 block">{{ act.message }}</span>
                    <span class="text-[11px] text-slate-400">{{ formatRelativeTime(act.timestamp) }}</span>
                  </div>
                </div>

                <router-link 
                  v-if="act.studentId" 
                  :to="`/ta/students/${act.studentId}`"
                  class="btn btn-secondary text-[11px] py-1 px-2.5 shrink-0"
                >
                  View Profile
                </router-link>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automatic alerts synced with student LMS submission timestamps.</span>
            <router-link to="/ta/notifications" class="font-semibold text-navy-700">
              TA Alerts Center →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Upcoming Deadlines for Assigned Students -->
      <div class="card p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900">Upcoming Deadlines for Assigned Students</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Aggregated view of assessments and OPPEs approaching across your students in the next 7-14 days.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <input 
                type="checkbox" 
                v-model="taStore.onlyAtRiskDeadlines"
                class="rounded text-navy-800 focus:ring-navy-600"
              />
              <span>Show only at-risk students' deadlines</span>
            </label>
          </div>
        </div>

        <div class="space-y-3">
          <div 
            v-for="dl in taStore.aggregatedDeadlines.slice(0, 6)" 
            :key="`${dl.studentId}_${dl.id}`"
            class="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors bg-white"
          >
            <div class="flex items-start gap-3">
              <div 
                :class="[
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs',
                  dl.daysRemaining < 3 ? 'bg-rose-100 text-rose-800' :
                  dl.daysRemaining <= 7 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                ]"
              >
                {{ dl.daysRemaining }}d
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-bold text-xs text-slate-900">{{ dl.studentName }}</span>
                  <span class="text-xs text-slate-400">({{ dl.rollNumber }})</span>
                  <RiskBadge :level="dl.studentRisk" />
                </div>
                <p class="text-xs text-slate-600 mt-0.5">
                  <strong class="text-navy-800">{{ dl.courseCode }}:</strong> {{ dl.taskName }} • Due {{ formatDate(dl.dueDate) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                type="button" 
                class="btn btn-secondary text-xs py-1 px-3"
                @click="openInterventionForStudent(dl.studentId)"
              >
                Log Intervention
              </button>
              <router-link 
                :to="`/ta/students/${dl.studentId}`" 
                class="btn btn-primary text-xs py-1 px-3"
              >
                Profile
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= TAB 2: STUDENT OVERVIEW ================= -->
    <div v-else class="space-y-5">
      <!-- Search, Filters, and View Mode Toggle -->
      <div class="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <!-- Search -->
        <div class="relative flex-1 max-w-sm">
          <input
            v-model="taStore.studentSearchQuery"
            type="text"
            placeholder="Search student by name or roll number..."
            class="w-full text-xs border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <!-- Filters & View Toggle -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <select 
            v-model="taStore.riskFilter"
            class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (🔴)</option>
            <option value="AT_RISK">At Risk (🟡)</option>
            <option value="SAFE">Safe (🟢)</option>
          </select>

          <select 
            v-model="taStore.termFilter"
            class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
          >
            <option value="ALL">All Terms</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
            <option value="4">Term 4</option>
            <option value="5">Term 5</option>
            <option value="6">Term 6</option>
          </select>

          <!-- Toggle Table / Card Grid -->
          <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              :class="[
                'p-1.5 rounded text-xs transition-colors',
                taStore.viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
              ]"
              title="Table View"
              @click="taStore.viewMode = 'table'"
            >
              <List class="w-4 h-4" />
            </button>
            <button
              type="button"
              :class="[
                'p-1.5 rounded text-xs transition-colors',
                taStore.viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500'
              ]"
              title="Card Grid View"
              @click="taStore.viewMode = 'cards'"
            >
              <LayoutGrid class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Actions Bar (when checkboxes selected) -->
      <div 
        v-if="taStore.selectedStudentIds.length > 0"
        class="card p-3.5 bg-navy-900 text-white flex items-center justify-between gap-4 animate-fadeIn"
      >
        <div class="flex items-center gap-2 text-xs font-semibold">
          <span class="w-5 h-5 rounded-full bg-navy-700 flex items-center justify-center text-[11px]">
            {{ taStore.selectedStudentIds.length }}
          </span>
          <span>student(s) selected</span>
        </div>

        <div class="flex items-center gap-2.5">
          <button 
            type="button" 
            class="btn bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20"
            @click="showBulkMessageModal = true"
          >
            <Mail class="w-3.5 h-3.5 mr-1.5" />
            Send Bulk Notification
          </button>

        </div>
      </div>

      <!-- VIEW 1: TABLE VIEW -->
      <div v-if="taStore.viewMode === 'table'" class="card p-4 overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-header w-8">
                <input 
                  type="checkbox" 
                  @change="taStore.selectAllFiltered" 
                  class="rounded text-navy-800 focus:ring-navy-600"
                />
              </th>
              <th class="table-header">Student Name & Roll</th>
              <th class="table-header">Risk Status</th>
              <th class="table-header">Level / Term</th>
              <th class="table-header">Courses In Progress</th>
              <th class="table-header">Last Activity</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="st in taStore.filteredAssignedStudents" 
              :key="st.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="table-cell">
                <input 
                  type="checkbox" 
                  :value="st.id" 
                  :checked="taStore.selectedStudentIds.includes(st.id)"
                  @change="taStore.toggleSelectStudent(st.id)"
                  class="rounded text-navy-800 focus:ring-navy-600"
                />
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-2.5">
                  <InitialsAvatar :name="st.name" role="student" size="sm" />
                  <div>
                    <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ st.name }}</div>
                    <div class="text-[11px] text-slate-400">{{ st.rollNumber }}</div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <RiskBadge :level="st.riskLevel" />
              </td>
              <td class="table-cell text-xs text-slate-700">
                {{ st.currentLevel }} • Term {{ st.termNumber }}
              </td>
              <td class="table-cell text-xs text-slate-700">
                {{ st.coursesInProgressCount || 2 }} Active Courses
              </td>
              <td class="table-cell text-xs text-slate-500">
                {{ formatRelativeTime(st.lastActivity) }}
              </td>
              <td class="table-cell text-right space-x-2">
                <button 
                  type="button" 
                  class="btn btn-secondary text-xs py-1 px-2.5"
                  @click="openInterventionForStudent(st.id)"
                >
                  Log Intervention
                </button>
                <router-link 
                  :to="`/ta/students/${st.id}`" 
                  class="btn btn-primary text-xs py-1 px-2.5"
                >
                  View Profile
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VIEW 2: CARD GRID VIEW -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="st in taStore.filteredAssignedStudents" 
          :key="st.id"
          class="card p-5 flex flex-col justify-between hover:border-slate-300 transition-all bg-white space-y-4"
        >
          <div>
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  :checked="taStore.selectedStudentIds.includes(st.id)"
                  @change="taStore.toggleSelectStudent(st.id)"
                  class="rounded text-navy-800 focus:ring-navy-600 mt-1"
                />
                <InitialsAvatar :name="st.name" role="student" size="lg" />
                <div>
                  <h4 class="font-bold text-slate-900 text-sm">{{ st.name }}</h4>
                  <p class="text-xs text-slate-400">{{ st.rollNumber }}</p>
                </div>
              </div>
              <RiskBadge :level="st.riskLevel" />
            </div>

            <!-- Stats strip -->
            <div class="grid grid-cols-2 gap-2 mt-4 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Level & Term</span>
                <span class="font-semibold text-slate-800">{{ st.currentLevel }} (T{{ st.termNumber }})</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Foundation</span>
                <span class="font-semibold text-slate-800">{{ st.foundationCompleted || 4 }}/8 Done</span>
              </div>
            </div>

            <!-- Risk Reason -->
            <div v-if="st.riskFactors?.[0]" class="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 mt-3">
              <strong>Main risk signal:</strong> {{ st.riskFactors[0].factor }}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button 
              type="button" 
              class="btn btn-secondary text-xs py-1 px-3 w-1/2"
              @click="openInterventionForStudent(st.id)"
            >
              Intervention
            </button>
            <router-link 
              :to="`/ta/students/${st.id}`" 
              class="btn btn-primary text-xs py-1 px-3 w-1/2 text-center"
            >
              Full Profile
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Intervention Modal -->
    <InterventionModal
      :is-open="showInterventionModal"
      :student="selectedStudentForIntervention"
      @close="showInterventionModal = false"
      @saved="handleInterventionSaved"
    />

    <!-- Bulk Message Modal -->
    <Modal
      :is-open="showBulkMessageModal"
      title="Send Bulk Notification to Selected Students"
      subtitle="Dispatches in-app message directly to student notification center"
      @close="showBulkMessageModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Message Content
          </label>
          <textarea 
            v-model="bulkMessageText"
            rows="4"
            class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
            placeholder="Type notification text (e.g., Reminder: Weekly Python doubt-clearing session starts at 4 PM today)..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showBulkMessageModal = false">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" @click="dispatchBulkMessage">
          Send Notification
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaStore } from '../../stores/taStore'
import { useToastStore } from '../../stores/toastStore'
import { mockDataService } from '../../services/mock/mockDataService'
import StatCard from '../../components/common/StatCard.vue'
import RiskBadge from '../../components/common/RiskBadge.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import DoughnutChart from '../../components/charts/DoughnutChart.vue'
import InterventionModal from '../../components/modals/InterventionModal.vue'
import Modal from '../../components/common/Modal.vue'
import { formatDate, formatRelativeTime } from '../../utils/formatters'
import {
  Users,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Search,
  List,
  LayoutGrid,
  Mail,
} from 'lucide-vue-next'

const taStore = useTaStore()
const toast = useToastStore()

const showInterventionModal = ref(false)
const selectedStudentForIntervention = ref(null)
const showBulkMessageModal = ref(false)
const bulkMessageText = ref('')

// Doughnut chart data
const riskDonutData = computed(() => {
  return {
    labels: ['Safe (🟢)', 'At Risk (🟡)', 'Critical (🔴)'],
    datasets: [
      {
        data: [
          taStore.stats.safe,
          taStore.stats.atRisk,
          taStore.stats.critical
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        hoverBackgroundColor: ['#059669', '#d97706', '#dc2626'],
        borderWidth: 0
      }
    ]
  }
})

function handleChartSegmentClick({ label }) {
  if (label.includes('Critical')) taStore.riskFilter = 'CRITICAL'
  else if (label.includes('Risk')) taStore.riskFilter = 'AT_RISK'
  else taStore.riskFilter = 'SAFE'
  taStore.activeTab = 'students'
}

function goToTabWithFilter(risk) {
  taStore.riskFilter = risk
  taStore.activeTab = 'students'
}

function openInterventionForStudent(studentId) {
  const st = mockDataService.getStudentById(studentId)
  selectedStudentForIntervention.value = st
  showInterventionModal.value = true
}

function handleInterventionSaved() {
  toast.success('Intervention successfully logged.')
}

function dispatchBulkMessage() {
  taStore.sendBulkNotification(bulkMessageText.value)
  showBulkMessageModal.value = false
  bulkMessageText.value = ''
}
</script>
