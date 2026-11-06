<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="card p-6 bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 text-white relative overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div class="flex items-center gap-4">
          <InitialsAvatar :name="student.name" role="student" size="xl" class="shadow-md ring-2 ring-white/30" />
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight">{{ student.name }}</h2>
              <RiskBadge :level="student.riskLevel" clickable @click="showRiskModal = true" />
            </div>
            <p class="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <span>Roll No: <strong>{{ student.rollNumber }}</strong></span>
              <span>•</span>
              <span>Level: <strong>{{ student.currentLevel }}</strong></span>
              <span>•</span>
              <span class="bg-navy-700/80 px-2 py-0.5 rounded text-white font-medium text-xs">
                Term {{ student.termNumber }} of {{ student.totalTerms }}
              </span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <button 
            type="button" 
            class="btn bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 backdrop-blur-sm"
            @click="showRiskModal = true"
          >
            <Info class="w-4 h-4 mr-1.5" />
            Why am I {{ student.riskLevel }}?
          </button>
          <router-link to="/student/course-planner" class="btn bg-white text-navy-900 hover:bg-slate-100 text-xs font-semibold shadow-sm">
            Course Planner
          </router-link>
        </div>
      </div>
    </div>

    <!-- Milestone Progress Card -->
    <div 
      :class="[
        'card p-6 border transition-all',
        hasMissedCheckpoint 
          ? 'bg-rose-50/50 border-rose-300' 
          : 'bg-white border-slate-200'
      ]"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Foundation Milestone Progress</span>
            <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {{ student.foundationCompleted }} of {{ student.foundationTotal }} Courses Completed
            </span>
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">Mandatory checkpoints to remain eligible for Diploma level progression.</p>
        </div>
        <div v-if="hasMissedCheckpoint">
          <button 
            type="button" 
            class="btn btn-danger text-xs font-semibold"
            @click="showRiskModal = true"
          >
            <AlertCircle class="w-4 h-4 mr-1.5" />
            See what this means for you
          </button>
        </div>
      </div>

      <!-- Main Progress Bar -->
      <div class="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200 mb-5">
        <div 
          class="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-navy-700 to-blue-600"
          :style="{ width: `${(student.foundationCompleted / student.foundationTotal) * 100}%` }"
        ></div>
      </div>

      <!-- Sub-Indicators (Checkpoints) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <!-- 4-in-4 Checkpoint -->
        <div class="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700">4 Courses in 4 Terms</span>
            <StatusBadge :status="student.checkpoints?.fourInFour?.status || 'MET'" />
          </div>
          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {{ student.checkpoints?.fourInFour?.detail }}
          </p>
        </div>

        <!-- 6-in-6 Checkpoint -->
        <div class="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700">6 Courses in 6 Terms</span>
            <StatusBadge :status="student.checkpoints?.sixInSix?.status || 'APPROACHING'" />
          </div>
          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {{ student.checkpoints?.sixInSix?.detail }}
          </p>
        </div>

        <!-- 8-in-9 Checkpoint -->
        <div class="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700">8 Courses in 9 Terms</span>
            <StatusBadge :status="student.checkpoints?.eightInNine?.status || 'WARNING'" />
          </div>
          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {{ student.checkpoints?.eightInNine?.detail }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Stats Row (4 stat cards side by side) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Courses Completed" 
        :value="student.coursesCompletedCount" 
        subtext="Credits Earned: 20"
        icon-name="CheckCircle"
        icon-bg-class="bg-emerald-50"
        icon-color-class="text-emerald-700"
      />
      <StatCard 
        label="Courses In Progress" 
        :value="student.coursesInProgressCount" 
        subtext="Enrolled Term 5"
        icon-name="BookOpen"
        icon-bg-class="bg-blue-50"
        icon-color-class="text-blue-700"
      />
      <StatCard 
        label="Assignments Pending" 
        :value="student.assignmentsPendingCount" 
        subtext="Due this week: 1"
        icon-name="FileText"
        icon-bg-class="bg-amber-50"
        icon-color-class="text-amber-700"
      />
      <StatCard 
        label="Quizzes Pending" 
        :value="student.quizzesPendingCount" 
        subtext="Upcoming Quiz 1"
        icon-name="Clock"
        icon-bg-class="bg-rose-50"
        icon-color-class="text-rose-700"
      />
    </div>

    <!-- 2-Column Section: Assigned TA & Recent Notifications Strip -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Assigned TA Card -->
      <div class="card p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Assigned TA</h4>
            <span class="badge badge-safe">Academic Support</span>
          </div>

          <div v-if="assignedTa" class="space-y-4">
            <div class="flex items-center gap-3">
              <InitialsAvatar :name="assignedTa.name" role="ta" size="lg" />
              <div>
                <h5 class="font-bold text-slate-900 text-sm">{{ assignedTa.name }}</h5>
                <p class="text-xs text-slate-500">{{ assignedTa.role }}</p>
                <p class="text-xs text-navy-700 font-medium mt-0.5">{{ assignedTa.department }}</p>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 space-y-1">
              <div><strong>Email:</strong> {{ assignedTa.email }}</div>
              <div><strong>Expertise:</strong> {{ assignedTa.expertise?.join(', ') }}</div>
              <div v-if="assignedTa.schedulePreferences?.days?.length || assignedTa.schedulePreferences?.slots?.length" class="border-t border-slate-200 pt-2">
                <strong>Consultation hours ({{ (assignedTa.schedulePreferences.frequency || 'Weekly').toLowerCase() }}):</strong>
                {{ assignedTa.schedulePreferences.days?.join(', ') || 'Days to be confirmed' }}
                <span v-if="assignedTa.schedulePreferences.slots?.length"> · {{ assignedTa.schedulePreferences.slots.join(', ') }}</span>
              </div>
              <div><strong>Bio:</strong> {{ assignedTa.bio }}</div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-slate-400">
            <UserX class="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p class="text-sm font-medium text-slate-600">No TA assigned yet</p>
            <p class="text-xs text-slate-400 mt-1">Teaching Assistants are assigned automatically upon risk flagging or admin review.</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <router-link to="/student/mentorship" class="btn btn-outline-primary w-full text-xs font-semibold">
            <MessageSquare class="w-4 h-4 mr-1.5" />
            Request Mentorship / Contact TA
          </router-link>
        </div>
      </div>

      <!-- Recent Notifications Strip (last 3 unread) -->
      <div class="card p-5 lg:col-span-2 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Alerts & Notices</h4>
            <router-link to="/student/notifications" class="text-xs font-semibold text-navy-700 hover:text-navy-900">
              View All Notifications →
            </router-link>
          </div>

          <div v-if="recentNotifications.length > 0" class="space-y-3">
            <div 
              v-for="notif in recentNotifications" 
              :key="notif.id"
              class="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
            >
              <div class="p-2 rounded-lg bg-navy-100 text-navy-800 shrink-0 mt-0.5">
                <Bell class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <h5 class="text-xs font-bold text-slate-900 truncate">{{ notif.title }}</h5>
                  <span class="text-[11px] text-slate-400 shrink-0">{{ formatRelativeTime(notif.timestamp) }}</span>
                </div>
                <p class="text-xs text-slate-600 mt-1 line-clamp-2">{{ notif.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-slate-400 text-xs">
            No unread notifications at this time.
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Synced with automated IITM academic alerting system.</span>
          <router-link to="/student/notifications" class="font-semibold text-navy-700">
            Open Notification Center
          </router-link>
        </div>
      </div>
    </div>

    <!-- Upcoming 5 Deadlines Widget -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="text-base font-bold text-slate-900">Upcoming Academic Deadlines</h4>
          <p class="text-xs text-slate-500 mt-0.5">Next 5 assessments and exams sorted chronologically</p>
        </div>
        <router-link to="/student/progress" class="text-xs font-semibold text-navy-700 hover:text-navy-900">
          Full Schedule →
        </router-link>
      </div>

      <div class="space-y-3">
        <div 
          v-for="item in student.upcomingDeadlines || []" 
          :key="item.id"
          class="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all bg-white"
        >
          <div class="flex items-start gap-3">
            <div 
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs',
                item.daysRemaining < 3 ? 'bg-rose-100 text-rose-800' :
                item.daysRemaining <= 7 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              ]"
            >
              {{ item.daysRemaining }}d
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-xs text-navy-800 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                  {{ item.courseCode }}
                </span>
                <span class="font-semibold text-sm text-slate-900">{{ item.taskName }}</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                {{ item.courseName }} • Due {{ formatDate(item.dueDate) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2.5 self-end sm:self-center">
            <span 
              :class="[
                'text-xs font-semibold px-2.5 py-1 rounded-full',
                item.daysRemaining < 3 ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                item.daysRemaining <= 7 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              ]"
            >
              {{ item.daysRemaining < 3 ? 'Urgent (<3 days)' : item.daysRemaining <= 7 ? 'Approaching (3-7 days)' : 'On Track (>7 days)' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Risk Explanation Modal -->
    <RiskExplanationModal 
      :is-open="showRiskModal" 
      :student="student"
      cta-label="Request Mentorship"
      @close="showRiskModal = false"
      @action="$router.push('/student/mentorship')"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStudentStore } from '../../stores/studentStore'
import { useNotificationStore } from '../../stores/notificationStore'
import RiskBadge from '../../components/common/RiskBadge.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import StatCard from '../../components/common/StatCard.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import RiskExplanationModal from '../../components/modals/RiskExplanationModal.vue'
import { formatDate, formatRelativeTime } from '../../utils/formatters'
import {
  Info,
  AlertCircle,
  CheckCircle,
  BookOpen,
  FileText,
  Clock,
  UserX,
  MessageSquare,
  Bell
} from 'lucide-vue-next'

const studentStore = useStudentStore()
const notifStore = useNotificationStore()

const student = computed(() => studentStore.student)
const assignedTa = computed(() => studentStore.assignedTa)
const showRiskModal = ref(false)

const hasMissedCheckpoint = computed(() => {
  return student.value?.checkpoints?.fourInFour?.status === 'MISSED' ||
         student.value?.checkpoints?.sixInSix?.status === 'MISSED'
})

const recentNotifications = computed(() => {
  return notifStore.currentNotifications.slice(0, 3)
})
</script>
