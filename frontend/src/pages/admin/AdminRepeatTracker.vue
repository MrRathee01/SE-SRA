<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Repeat Course & Curriculum Bottleneck Surveillance</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Surveillance of multiple course re-registrations powered by aggregate historical course data from <strong>data.xlsx</strong>.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="badge badge-safe">Data Source: data.xlsx (91 Courses)</span>
      </div>
    </div>

    <!-- Course Bottleneck Summary Chart & Drilldown (From data.xlsx) -->
    <div class="card p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 class="text-base font-bold text-slate-900">Top 6 Program Bottleneck Courses (Repeat Volume)</h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Sourced directly from provided course-wise attempt distributions. Click any course bar or row to view multi-attempt breakdown (1-time through &gt;9 times).
          </p>
        </div>
        <span class="text-xs text-slate-400 font-medium">Click bar to inspect attempt spectrum</span>
      </div>

      <div class="h-64">
        <BarChart :chart-data="topCoursesChartData" :options="topCoursesChartOptions" />
      </div>

      <!-- Top 6 Quick Cards with Click Details -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
        <div 
          v-for="c in adminStore.topBottleneckCourses" 
          :key="c.course_code"
          class="p-3 bg-slate-50 hover:bg-navy-50 rounded-xl border border-slate-200 cursor-pointer transition-colors text-center"
          @click="openCourseDetails(c)"
        >
          <span class="font-bold text-xs text-navy-800 block truncate">{{ c.course_code }}</span>
          <span class="text-[11px] text-slate-600 block truncate">{{ c.course_name }}</span>
          <span class="text-xs font-extrabold text-rose-700 block mt-1">
            {{ formatNumber(c.total_repeats) }} repeats
          </span>
          <span class="text-[10px] text-slate-400 font-medium">{{ c.repeat_rate_pct }}% repeat rate</span>
        </div>
      </div>
    </div>

    <!-- Repeat Offender Students Table -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Repeat Loop Students (Attempt Count ≥ 2)</h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Students currently repeating courses; requiring mandatory counseling or committee escalation.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-700">
            {{ adminStore.repeatOffenders.length }} Repeat Attempts Active
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-header">Student</th>
              <th class="table-header">Course Repeated</th>
              <th class="table-header">Attempts</th>
              <th class="table-header">Latest Score / Exam</th>
              <th class="table-header">Risk Level</th>
              <th class="table-header">Assigned TA</th>
              <th class="table-header">Last Intervention</th>
              <th class="table-header text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="item in adminStore.repeatOffenders" 
              :key="item.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="table-cell">
                <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ item.studentName }}</div>
                <div class="text-[11px] text-slate-400">{{ item.rollNumber }}</div>
              </td>
              <td class="table-cell">
                <div class="font-bold text-xs text-navy-800">{{ item.courseCode }}</div>
                <div class="text-[11px] text-slate-500 truncate max-w-xs">{{ item.courseName }}</div>
              </td>
              <td class="table-cell">
                <span class="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded border border-amber-300">
                  Attempt {{ item.attempts }}
                </span>
              </td>
              <td class="table-cell text-xs font-medium text-slate-700">
                {{ item.latestScore }}
              </td>
              <td class="table-cell">
                <RiskBadge :level="item.riskLevel" />
              </td>
              <td class="table-cell text-xs font-medium text-slate-800">
                {{ item.taAssigned }}
              </td>
              <td class="table-cell text-xs text-slate-500">
                {{ item.lastIntervention }}
              </td>
              <td class="table-cell text-right space-x-1.5 whitespace-nowrap">
                <button 
                  type="button" 
                  class="btn btn-secondary text-xs py-1 px-2.5 font-semibold text-rose-700 hover:bg-rose-50"
                  @click="escalateToCommittee(item)"
                >
                  <AlertOctagon class="w-3 h-3 mr-1" />
                  Escalate
                </button>
                <button 
                  type="button" 
                  class="btn btn-outline-primary text-xs py-1 px-2.5 font-semibold"
                  @click="flagForIntervention(item)"
                >
                  Flag Int.
                </button>
                <button 
                  type="button" 
                  class="btn btn-primary text-xs py-1 px-2.5"
                  @click="assignTa(item.studentId)"
                >
                  Assign TA
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Course Details Breakdown Modal (From data.xlsx attempts) -->
    <Modal
      :is-open="showCourseModal"
      :title="selectedCourse ? `${selectedCourse.course_code}: ${selectedCourse.course_name}` : 'Course Details'"
      subtitle="Complete attempt distribution spectrum from official academic dataset"
      max-width="max-w-2xl"
      @close="showCourseModal = false"
    >
      <div v-if="selectedCourse" class="space-y-4 text-xs">
        <!-- Totals summary -->
        <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Total Registrations</span>
            <span class="text-base font-bold text-slate-900">{{ formatNumber(selectedCourse.total_students) }}</span>
          </div>
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Total Repeat Attempts</span>
            <span class="text-base font-bold text-rose-700">{{ formatNumber(selectedCourse.total_repeats) }}</span>
          </div>
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Repeat Rate</span>
            <span class="text-base font-bold text-amber-600">{{ selectedCourse.repeat_rate_pct }}%</span>
          </div>
        </div>

        <h4 class="font-bold text-slate-900 text-sm">Attempt Distribution Spectrum (1st attempt to >9 attempts)</h4>
        
        <div class="space-y-2">
          <div 
            v-for="(val, key) in selectedCourse.attempts" 
            :key="key"
            class="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
          >
            <span class="font-medium text-slate-700">
              {{ key === 'gt9' ? 'More than 9 Attempts' : `${key} Attempt(s)` }}
            </span>
            <div class="flex items-center gap-3">
              <span class="font-bold text-slate-900">{{ formatNumber(val) }} students</span>
              <span class="text-[11px] text-slate-400 w-12 text-right">
                {{ selectedCourse.total_students > 0 ? ((val / selectedCourse.total_students) * 100).toFixed(1) : 0 }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showCourseModal = false">Close</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../stores/adminStore'
import { useToastStore } from '../../stores/toastStore'
import { mockDataService } from '../../services/mock/mockDataService'
import BarChart from '../../components/charts/BarChart.vue'
import RiskBadge from '../../components/common/RiskBadge.vue'
import Modal from '../../components/common/Modal.vue'
import { AlertOctagon } from 'lucide-vue-next'

const adminStore = useAdminStore()
const toast = useToastStore()

const showCourseModal = ref(false)
const selectedCourse = ref(null)

function formatNumber(num) {
  if (!num) return '0'
  return new Intl.NumberFormat('en-IN').format(num)
}

function openCourseDetails(course) {
  selectedCourse.value = course
  showCourseModal.value = true
}

const topCoursesChartData = computed(() => {
  const top = adminStore.topBottleneckCourses
  return {
    labels: top.map(c => c.course_code),
    datasets: [
      {
        label: 'Total Repeat Attempts (data.xlsx)',
        data: top.map(c => c.total_repeats),
        backgroundColor: '#f59e0b',
        borderRadius: 4
      },
      {
        label: 'First-Time Cleared / Enrolled',
        data: top.map(c => c.attempts['1'] || 0),
        backgroundColor: '#1e3757',
        borderRadius: 4
      }
    ]
  }
})

const topCoursesChartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${new Intl.NumberFormat('en-IN').format(ctx.raw)} students`
      }
    }
  }
}

function escalateToCommittee(item) {
  mockDataService.activityFeed.unshift({
    id: `act-${Date.now()}`,
    type: 'ESCALATION',
    message: `${item.studentName} (${item.rollNumber}) escalated to Academic Review Committee for repeat course ${item.courseCode}`,
    timestamp: new Date().toISOString(),
    studentId: item.studentId,
    studentName: item.studentName
  })
  toast.success(`Escalated ${item.studentName} to the Academic Committee.`)
}

function flagForIntervention(item) {
  toast.info(`Flagged ${item.studentName} for urgent remedial intervention.`)
}

function assignTa(studentId) {
  const st = mockDataService.getStudentById(studentId)
  if (st) adminStore.openAssignmentWizard(st)
}
</script>

