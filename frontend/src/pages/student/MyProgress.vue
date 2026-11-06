<template>
  <div class="space-y-6">
    <!-- Header Summary -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Academic Progress & Evaluation History</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Comprehensive performance log across terms, assignment submissions, quiz evaluations, and repeat course attempts.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[100px]">
          <span class="text-[10px] text-slate-500 uppercase font-semibold block">CGPA (Projected)</span>
          <span class="text-lg font-bold text-slate-900">7.2 / 10</span>
        </div>
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[100px]">
          <span class="text-[10px] text-slate-500 uppercase font-semibold block">Courses Cleared</span>
          <span class="text-lg font-bold text-emerald-700">5 Courses</span>
        </div>
      </div>
    </div>

    <!-- Performance Trend Chart -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Term-by-Term Grade Performance Trend</h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Average grade points per term with milestone markers for 4-in-4 and 6-in-6 checkpoints.
          </p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-navy-800"></span> Student Grade Point</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-emerald-500"></span> Milestone Target (7.0)</span>
        </div>
      </div>

      <div class="h-64">
        <LineChart :chart-data="trendChartData" :options="trendChartOptions" />
      </div>
    </div>

    <!-- Dedicated Repeat Course Section -->
    <div class="card p-6 border-l-4 border-l-amber-500">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-slate-900">Repeat Course Tracker</h3>
            <span class="badge badge-warning">Multiple Attempts</span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Courses attempted more than once. If repeated 2+ times, reach out to your TA for dedicated remediation.
          </p>
        </div>

        <router-link to="/student/mentorship" class="btn btn-warning text-xs font-semibold">
          Reach out to TA
        </router-link>
      </div>

      <div class="space-y-4">
        <div 
          v-for="rep in repeatCourses" 
          :key="rep.courseCode"
          class="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="font-bold text-sm text-navy-900">{{ rep.courseCode }} • {{ rep.courseName }}</span>
              <span class="ml-2 text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Attempt {{ rep.attempts }} of 3
              </span>
            </div>
            <StatusBadge :status="rep.status" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="bg-white p-2.5 rounded-lg border border-slate-200">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Previous Attempt</span>
              <span class="font-medium text-slate-800">Term 3 (Grade U - 42%)</span>
            </div>
            <div class="bg-white p-2.5 rounded-lg border border-slate-200">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Current Attempt</span>
              <span class="font-medium text-slate-800">Term 5 (Ongoing)</span>
            </div>
            <div class="bg-white p-2.5 rounded-lg border border-slate-200">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">OPPE Status</span>
              <span class="font-medium text-amber-700">Scheduled for Nov 15</span>
            </div>
          </div>

          <div class="text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200/70">
            ⚠️ <strong>Academic Notice:</strong> Multiple attempts detected in Programming in Python. You are linked with TA Dr. Priya Ramachandran for mock OPPE coding practice sessions.
          </div>
        </div>
      </div>
    </div>

    <!-- Course History Table with Filter and Sorting -->
    <div class="card p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Complete Course Enrollment History</h3>
          <p class="text-xs text-slate-500 mt-0.5">Filter by term, status, or grade</p>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <select 
            v-model="historyFilterTerm"
            class="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-navy-600"
          >
            <option value="ALL">All Terms</option>
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
            <option value="5">Term 5 (Current)</option>
          </select>

          <select 
            v-model="historyFilterStatus"
            class="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-navy-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-header">Course Name</th>
              <th class="table-header">Term</th>
              <th class="table-header">Grade</th>
              <th class="table-header">Attempts</th>
              <th class="table-header">Score / OPPE</th>
              <th class="table-header">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="item in filteredCourseHistory" 
              :key="`${item.courseCode}_${item.term}_${item.attempts}`"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="table-cell font-semibold text-slate-900">
                <div>{{ item.courseName }}</div>
                <div class="text-[11px] text-slate-400 font-normal">{{ item.courseCode }}</div>
              </td>
              <td class="table-cell text-slate-600">{{ item.term }}</td>
              <td class="table-cell">
                <span 
                  :class="[
                    'font-bold px-2 py-0.5 rounded text-xs',
                    item.grade === 'S' || item.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                    item.grade === 'B' || item.grade === 'C' ? 'bg-blue-100 text-blue-800' :
                    item.grade === 'U' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  {{ item.grade }}
                </span>
              </td>
              <td class="table-cell">
                <span 
                  v-if="item.attempts > 1"
                  class="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded border border-amber-300"
                >
                  Attempt {{ item.attempts }}
                </span>
                <span v-else class="text-slate-600 text-xs">
                  Attempt 1
                </span>
              </td>
              <td class="table-cell text-xs text-slate-600">
                {{ item.score ? `${item.score}%` : (item.oppeStatus || '—') }}
              </td>
              <td class="table-cell">
                <StatusBadge :status="item.status" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assignment & Quiz Breakdown Tracker -->
    <div class="card p-6">
      <h3 class="text-base font-bold text-slate-900 mb-1">Assignment & Quiz Evaluation Breakdown</h3>
      <p class="text-xs text-slate-500 mb-4">Detailed assessment completion rates and average score distributions.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="item in student.courseHistory.slice(0, 4)" 
          :key="item.courseCode"
          class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-slate-900">{{ item.courseCode }} • {{ item.courseName }}</span>
            <span class="text-[11px] text-slate-500">{{ item.term }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2 bg-white rounded-lg border border-slate-200">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Assignments</span>
              <span class="font-bold text-slate-800">{{ item.assignmentsCompleted || '10/10' }}</span>
              <span class="text-slate-500 block text-[10px]">Avg Score: {{ item.assignmentsAvg || 80 }}%</span>
            </div>

            <div class="p-2 bg-white rounded-lg border border-slate-200">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Quizzes</span>
              <span class="font-bold text-slate-800">{{ item.quizzesCompleted || '2/2' }}</span>
              <span class="text-slate-500 block text-[10px]">Avg Score: {{ item.quizzesAvg || 75 }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStudentStore } from '../../stores/studentStore'
import LineChart from '../../components/charts/LineChart.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'

const studentStore = useStudentStore()
const student = computed(() => studentStore.student)

const historyFilterTerm = ref('ALL')
const historyFilterStatus = ref('ALL')

const filteredCourseHistory = computed(() => {
  let list = student.value?.courseHistory || []

  if (historyFilterTerm.value !== 'ALL') {
    list = list.filter(item => item.termNumber === Number(historyFilterTerm.value))
  }

  if (historyFilterStatus.value !== 'ALL') {
    list = list.filter(item => item.status.toLowerCase() === historyFilterStatus.value.toLowerCase())
  }

  return list
})

const repeatCourses = computed(() => {
  return (student.value?.courseHistory || []).filter(item => item.attempts > 1)
})

const trendChartData = computed(() => {
  const averages = student.value?.termAverages || []
  return {
    labels: averages.map(a => a.term),
    datasets: [
      {
        label: 'Student Grade Point (out of 10)',
        data: averages.map(a => a.avgGradePoint),
        borderColor: '#1e3757',
        backgroundColor: 'rgba(30, 55, 87, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#1e3757',
        pointRadius: 5
      },
      {
        label: 'Milestone Pace Target (7.0)',
        data: averages.map(() => 7.0),
        borderColor: '#10b981',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      }
    ]
  }
})

const trendChartOptions = {
  scales: {
    y: {
      min: 0,
      max: 10,
      ticks: { stepSize: 2 }
    }
  }
}
</script>

