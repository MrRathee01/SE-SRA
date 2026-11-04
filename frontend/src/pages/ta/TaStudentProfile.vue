<template>
  <div v-if="student" class="space-y-6">
    <!-- Student Header Card -->
    <div class="card p-6 bg-white border border-slate-200">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img 
            :src="student.avatar" 
            class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200" 
            alt="Student Avatar"
          />
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900">{{ student.name }}</h2>
              <RiskBadge :level="student.riskLevel" />
            </div>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              Roll No: <strong>{{ student.rollNumber }}</strong> • {{ student.currentLevel }} • Term {{ student.termNumber }} of {{ student.totalTerms }} • Program: {{ student.program }}
            </p>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <button 
            type="button" 
            class="btn btn-secondary text-xs"
            @click="showNotificationModal = true"
          >
            <Mail class="w-3.5 h-3.5 mr-1.5" />
            Send Notification
          </button>
          <button 
            type="button" 
            class="btn btn-primary text-xs"
            @click="showInterventionModal = true"
          >
            <PlusCircle class="w-3.5 h-3.5 mr-1.5" />
            Log Intervention
          </button>
          <button 
            type="button" 
            class="btn btn-warning text-xs font-bold"
            @click="flagForAdmin"
          >
            <Flag class="w-3.5 h-3.5 mr-1.5" />
            Flag for Admin
          </button>
        </div>
      </div>
    </div>

    <!-- Main Grid: Tabs on Left, Risk Explanation Panel on Right -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Tabs (Academic History, Performance Trends, Intervention History) -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Sub-Tabs Navigation -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all',
              activeTab === 'history' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="activeTab = 'history'"
          >
            Academic History & TA Notes
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all',
              activeTab === 'trends' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="activeTab = 'trends'"
          >
            Performance Trends
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all',
              activeTab === 'interventions' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="activeTab = 'interventions'"
          >
            Intervention Ledger ({{ studentInterventions.length }})
          </button>
        </div>

        <!-- TAB 1: ACADEMIC HISTORY & PRIVATE TA NOTES -->
        <div v-if="activeTab === 'history'" class="card p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Course Enrollment Records & Private Notes
            </h3>
            <span class="text-xs text-slate-500">Private TA notes are saved and visible only to TAs and Admins</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="table-header">Course</th>
                  <th class="table-header">Term</th>
                  <th class="table-header">Grade</th>
                  <th class="table-header">Attempts</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">TA Private Note</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="c in student.courseHistory || []" 
                  :key="c.courseCode"
                  class="hover:bg-slate-50 transition-colors"
                >
                  <td class="table-cell font-bold text-slate-900">
                    {{ c.courseCode }}
                    <span class="block text-[11px] font-normal text-slate-500">{{ c.courseName }}</span>
                  </td>
                  <td class="table-cell text-xs text-slate-600">{{ c.term }}</td>
                  <td class="table-cell text-xs font-bold">{{ c.grade }}</td>
                  <td class="table-cell">
                    <span 
                      v-if="c.attempts > 1" 
                      class="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded"
                    >
                      Attempt {{ c.attempts }}
                    </span>
                    <span v-else class="text-xs text-slate-600">1</span>
                  </td>
                  <td class="table-cell">
                    <StatusBadge :status="c.status" />
                  </td>
                  <td class="table-cell min-w-[200px]">
                    <div class="flex items-center gap-1.5">
                      <input 
                        type="text" 
                        v-model="notesMap[c.courseCode]" 
                        placeholder="Add private note..."
                        class="text-xs border border-slate-200 rounded px-2 py-1 w-full bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-600"
                        @blur="saveNote(c.courseCode)"
                      />
                      <button 
                        type="button" 
                        class="btn btn-secondary text-[10px] py-1 px-1.5 shrink-0"
                        title="Save note"
                        @click="saveNote(c.courseCode)"
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: PERFORMANCE TRENDS & COHORT COMPARISON -->
        <div v-if="activeTab === 'trends'" class="card p-6 space-y-6">
          <div>
            <h3 class="text-base font-bold text-slate-900 mb-1">
              Student vs Anonymized Cohort Grade Average
            </h3>
            <p class="text-xs text-slate-500 mb-4">
              Comparing student's term grade average with the overall cohort mean.
            </p>
            <div class="h-64">
              <LineChart :chart-data="cohortComparisonData" />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span class="font-bold text-slate-900 block mb-1">Assignment Submission Rate</span>
              <p class="text-slate-600">Current term submission rate: <strong>68%</strong> (Cohort benchmark: 85%).</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span class="font-bold text-slate-900 block mb-1">OPPE Readiness Indicator</span>
              <p class="text-slate-600">Mock lab coding tests attempted: <strong>1 of 3</strong>. Recommended for weekend drill.</p>
            </div>
          </div>
        </div>

        <!-- TAB 3: INTERVENTION HISTORY -->
        <div v-if="activeTab === 'interventions'" class="card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900">Historical Intervention Ledger</h3>
              <p class="text-xs text-slate-500 mt-0.5">Chronological record of meetings, advisories, and outcomes.</p>
            </div>
            <button 
              type="button" 
              class="btn btn-primary text-xs"
              @click="showInterventionModal = true"
            >
              <PlusCircle class="w-3.5 h-3.5 mr-1.5" />
              Log New Intervention
            </button>
          </div>

          <div v-if="studentInterventions.length > 0" class="space-y-3">
            <div 
              v-for="item in studentInterventions" 
              :key="item.id"
              class="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900 text-sm">{{ item.type }}</span>
                  <span class="text-slate-500">by {{ item.taName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400">{{ formatDate(item.date) }}</span>
                  <StatusBadge :status="item.outcome" />
                </div>
              </div>

              <p class="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                {{ item.notes }}
              </p>

              <div class="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Follow-up target: {{ formatDate(item.followUpDue) }}</span>
                <span class="font-medium text-navy-700">Status: {{ item.status }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-slate-400 text-xs">
            No interventions logged for this student yet.
          </div>
        </div>
      </div>

      <!-- Right Column: AI Risk Explanation Panel -->
      <div class="space-y-5">
        <div class="card p-5 border-l-4 border-l-amber-500 bg-white">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Risk Diagnostics
            </h3>
            <span class="text-xs font-bold text-amber-700">Score: {{ student.riskScore }}/100</span>
          </div>

          <p class="text-xs text-slate-600 mb-4">
            Factors identified by the automated monitoring pipeline:
          </p>

          <div class="space-y-3">
            <div 
              v-for="(rf, i) in student.riskFactors || []" 
              :key="i"
              class="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900">{{ rf.factor }}</span>
                <span 
                  :class="[
                    'text-[10px] font-bold px-1.5 py-0.5 rounded uppercase',
                    rf.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  ]"
                >
                  {{ rf.severity }}
                </span>
              </div>
              <p class="text-[11px] text-slate-600">{{ rf.detail }}</p>
              <div v-if="rf.impact" class="text-[10px] font-semibold text-slate-500 pt-0.5">
                Impact: {{ rf.impact }}
              </div>
            </div>
          </div>

          <!-- Pacing Checkpoints status -->
          <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div class="font-semibold text-slate-800 uppercase text-[10px] tracking-wider">Checkpoints</div>
            <div class="flex items-center justify-between">
              <span>4-in-4 Checkpoint:</span>
              <StatusBadge :status="student.checkpoints?.fourInFour?.status || 'MET'" />
            </div>
            <div class="flex items-center justify-between">
              <span>6-in-6 Checkpoint:</span>
              <StatusBadge :status="student.checkpoints?.sixInSix?.status || 'APPROACHING'" />
            </div>
            <div class="flex items-center justify-between">
              <span>8-in-9 Checkpoint:</span>
              <StatusBadge :status="student.checkpoints?.eightInNine?.status || 'WARNING'" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Intervention Modal -->
    <InterventionModal
      :is-open="showInterventionModal"
      :student="student"
      @close="showInterventionModal = false"
      @saved="refreshInterventions"
    />

    <!-- Send Notification Modal -->
    <Modal
      :is-open="showNotificationModal"
      title="Dispatch Direct Notification"
      subtitle="Send a personalized notification to this student's alert center"
      @close="showNotificationModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Subject / Title
          </label>
          <input 
            type="text" 
            v-model="notifTitle" 
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
            placeholder="e.g. Schedule 1-on-1 OPPE Practice"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Message
          </label>
          <textarea 
            v-model="notifMessage" 
            rows="4"
            class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:outline-none"
            placeholder="Write message details..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showNotificationModal = false">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" @click="sendNotification">
          Send Notification
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockDataService } from '../../services/mock/mockDataService'
import { useTaStore } from '../../stores/taStore'
import { useToastStore } from '../../stores/toastStore'
import RiskBadge from '../../components/common/RiskBadge.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import LineChart from '../../components/charts/LineChart.vue'
import InterventionModal from '../../components/modals/InterventionModal.vue'
import Modal from '../../components/common/Modal.vue'
import { formatDate } from '../../utils/formatters'
import { Mail, PlusCircle, Flag } from 'lucide-vue-next'

const route = useRoute()
const taStore = useTaStore()
const toast = useToastStore()

const studentId = computed(() => route.params.id || 'student-demo')
const student = computed(() => mockDataService.getStudentById(studentId.value) || mockDataService.getStudentById('student-demo'))

const activeTab = ref('history')
const showInterventionModal = ref(false)
const showNotificationModal = ref(false)
const notifTitle = ref('TA Check-in Notice')
const notifMessage = ref('Please book a slot during doubt-clearing hours to review your recent coursework.')

const notesMap = ref({})

onMounted(() => {
  if (student.value?.courseHistory) {
    student.value.courseHistory.forEach(c => {
      notesMap.value[c.courseCode] = taStore.getCourseNote(student.value.id, c.courseCode)
    })
  }
})

function saveNote(courseCode) {
  taStore.saveCourseNote(student.value.id, courseCode, notesMap.value[courseCode])
}

const studentInterventions = computed(() => {
  return mockDataService.getInterventionsForStudent(student.value.id)
})

function refreshInterventions() {
  toast.success('Intervention ledger updated.')
}

function flagForAdmin() {
  mockDataService.activityFeed.unshift({
    id: `act-${Date.now()}`,
    type: 'FLAG_ADMIN',
    message: `TA flagged ${student.value.name} (${student.value.rollNumber}) for Admin Academic Review`,
    timestamp: new Date().toISOString(),
    studentId: student.value.id,
    studentName: student.value.name
  })
  toast.success(`Flagged ${student.value.name} for Admin Academic Review.`)
}

function sendNotification() {
  mockDataService.createNotification({
    recipientType: 'STUDENT',
    recipientId: student.value.id,
    category: 'TA',
    title: notifTitle.value,
    description: notifMessage.value,
    actionType: 'NAVIGATE',
    actionRoute: '/student/dashboard',
    actionLabel: 'Open Dashboard'
  })
  toast.success(`Notification sent to ${student.value.name}.`)
  showNotificationModal.value = false
}

const cohortComparisonData = computed(() => {
  const averages = student.value?.termAverages || []
  return {
    labels: averages.map(a => a.term),
    datasets: [
      {
        label: `${student.value?.name || 'Student'} Avg`,
        data: averages.map(a => a.avgGradePoint),
        borderColor: '#1e3757',
        backgroundColor: 'rgba(30, 55, 87, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Program Cohort Average (Anonymized)',
        data: averages.map(() => 7.8),
        borderColor: '#94a3b8',
        borderDash: [4, 4],
        fill: false
      }
    ]
  }
})
</script>

