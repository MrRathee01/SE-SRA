<template>
  <div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Student Risk & Progression Directory</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Program cohort surveillance with risk grading, milestone monitoring, and TA assignment routing.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="btn btn-secondary text-xs"
          @click="adminStore.exportStudentsToCsv"
        >
          <Download class="w-3.5 h-3.5 mr-1.5" />
          Export Table (CSV)
        </button>
      </div>
    </div>

    <!-- Student tier filters -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
      <button
        type="button"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0',
          adminStore.studentActiveTab === 'ALL' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
        ]"
        @click="adminStore.studentActiveTab = 'ALL'"
      >
        <span>All</span>
        <span class="text-[10px] bg-slate-200/50 px-1.5 py-0.5 rounded text-slate-700 font-normal">
          {{ adminStore.allStudents.length }}
        </span>
      </button>

      <button
        type="button"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0',
          adminStore.studentActiveTab === 'CRITICAL' ? 'bg-rose-700 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-50'
        ]"
        @click="adminStore.studentActiveTab = 'CRITICAL'"
      >
        <span>🔴 Critical</span>
        <span class="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-bold">
          {{ adminStore.kpiStats.critical }}
        </span>
      </button>

      <button
        type="button"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0',
          adminStore.studentActiveTab === 'AT_RISK' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'
        ]"
        @click="adminStore.studentActiveTab = 'AT_RISK'"
      >
        <span>🟡 At Risk</span>
        <span class="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
          {{ adminStore.kpiStats.atRisk }}
        </span>
      </button>

      <button
        type="button"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0',
          adminStore.studentActiveTab === 'SAFE' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'
        ]"
        @click="adminStore.studentActiveTab = 'SAFE'"
      >
        <span>🟢 Safe</span>
        <span class="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
          {{ adminStore.kpiStats.safe }}
        </span>
      </button>

    </div>

    <!-- Search & Filters Row -->
    <div class="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-sm">
        <input
          v-model="adminStore.studentSearchQuery"
          type="text"
          placeholder="Search by name, roll no, or email..."
          class="w-full text-xs border border-slate-300 rounded-lg pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
        />
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-2 flex-wrap">
        <select 
          v-model="adminStore.filterLevel"
          class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
        >
          <option value="ALL">All Levels</option>
          <option value="FOUNDATION">Foundation</option>
          <option value="DIPLOMA">Diploma</option>
        </select>

        <select 
          v-model="adminStore.filterTerm"
          class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
        >
          <option value="ALL">All Terms</option>
          <option value="1">Term 1</option>
          <option value="2">Term 2</option>
          <option value="3">Term 3</option>
          <option value="4">Term 4</option>
          <option value="5">Term 5</option>
          <option value="6">Term 6</option>
          <option value="7">Term 7</option>
        </select>

        <select 
          v-model="adminStore.filterAssignedTa"
          class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
        >
          <option value="ALL">All TAs</option>
          <option v-for="ta in adminStore.allTas" :key="ta.id" :value="ta.id">
            {{ ta.name }}
          </option>
        </select>

        <select 
          v-model="adminStore.sortBy"
          class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none font-semibold text-slate-700"
        >
          <option value="riskScore">Sort by: Risk Score</option>
          <option value="name">Sort by: Student Name</option>
          <option value="termNumber">Sort by: Term</option>
          <option value="foundationCompleted">Sort by: Completed Courses</option>
        </select>
      </div>
    </div>

    <!-- Bulk notification and export actions -->
    <div 
      v-if="adminStore.selectedStudentIds.length > 0"
      class="card p-3.5 bg-navy-900 text-white flex items-center justify-between gap-4 animate-fadeIn"
    >
      <div class="flex items-center gap-2 text-xs font-semibold">
        <span class="w-5 h-5 rounded-full bg-navy-700 flex items-center justify-center text-[11px]">
          {{ adminStore.selectedStudentIds.length }}
        </span>
        <span>student(s) selected for bulk operation</span>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap">
        <button 
          type="button" 
          class="btn bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20"
          @click="showBulkMessageModal = true"
        >
          <Mail class="w-3.5 h-3.5 mr-1.5" />
          Send Bulk Notification
        </button>

        <button 
          type="button" 
          class="btn bg-white text-slate-900 text-xs font-bold"
          @click="adminStore.exportStudentsToCsv"
        >
          <Download class="w-3.5 h-3.5 mr-1.5" />
          Export Selected
        </button>
      </div>
    </div>

    <!-- Student Data Table -->
    <div class="card overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-slate-500" aria-live="polite">
          Showing {{ resultStart }}–{{ resultEnd }} of {{ adminStore.filteredStudents.length }} students
        </p>
        <label class="flex items-center gap-2 text-xs text-slate-600">
          Rows per page
          <select v-model.number="pageSize" class="rounded-lg border border-slate-300 bg-white px-2 py-1.5">
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </label>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-header w-8">
              <input 
                type="checkbox" 
                :checked="allPageStudentsSelected"
                :disabled="currentPageStudents.length === 0"
                aria-label="Select all students on this page"
                @change="adminStore.selectAllStudents(currentPageStudents.map(student => student.id))"
                class="rounded text-navy-800 focus:ring-navy-600"
              />
              </th>
              <th class="table-header">Student Name</th>
              <th class="table-header">Roll Number</th>
              <th class="table-header">Level & Term</th>
              <th class="table-header">Foundation Done</th>
              <th class="table-header">Risk Score</th>
              <th class="table-header">Assigned TA</th>
              <th class="table-header">Last Intervention</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="st in currentPageStudents"
              :key="st.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="table-cell">
              <input
                type="checkbox"
                :value="st.id"
                :checked="adminStore.selectedStudentIds.includes(st.id)"
                @change="adminStore.toggleSelectStudent(st.id)"
                class="rounded text-navy-800 focus:ring-navy-600"
              />
              </td>
              <td class="table-cell">
              <div class="flex items-center gap-2.5">
                <InitialsAvatar :name="st.name" role="student" size="sm" />
                <div>
                  <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ st.name }}</div>
                  <div class="text-[11px] text-slate-400">{{ st.studentEmail }}</div>
                </div>
              </div>
              </td>
              <td class="table-cell font-mono text-xs font-semibold text-slate-700">{{ st.rollNumber }}</td>
              <td class="table-cell text-xs text-slate-700">{{ st.currentLevel }} • Term {{ st.termNumber }}</td>
              <td class="table-cell">
              <span class="font-semibold text-xs text-slate-800">{{ st.foundationCompleted || 4 }}/8</span>
              </td>
              <td class="table-cell">
              <div class="flex items-center gap-2">
                <span
                  :title="flagTooltip(st)"
                  :aria-label="flagTooltip(st) || `Current risk tier: ${st.riskLevel}`"
                  class="inline-flex"
                >
                  <RiskBadge :level="st.riskLevel" />
                </span>
                <span class="text-xs font-bold text-slate-700">({{ st.riskScore || 65 }})</span>
              </div>
              </td>
              <td class="table-cell text-xs">
              <span v-if="getTaName(st.assignedTaId)" class="font-medium text-navy-800">{{ getTaName(st.assignedTaId) }}</span>
              <span v-else class="text-slate-400 italic">Unassigned</span>
              </td>
              <td class="table-cell text-xs text-slate-500">{{ getLastIntervention(st.id) }}</td>
              <td class="table-cell text-right space-x-1.5 whitespace-nowrap">
              <router-link
                :to="`/admin/students/${st.id}`"
                class="btn btn-secondary text-xs py-1 px-2.5"
                title="View Admin Profile"
              >
                View
              </router-link>
              <button
                type="button"
                class="btn btn-outline-primary text-xs py-1 px-2.5 font-semibold"
                title="Assign / Reassign TA"
                @click="adminStore.openAssignmentWizard(st)"
              >
                Assign TA
              </button>
              <button
                type="button"
                class="btn btn-secondary text-xs py-1 px-2.5"
                :title="st.flagStatus?.isFlagged ? 'Update admin flag' : 'Set admin risk flag'"
                @click="openFlagDialog(st)"
              >
                {{ st.flagStatus?.isFlagged ? 'Edit flag' : 'Flag' }}
              </button>
              <button
                type="button"
                class="btn btn-primary text-xs py-1 px-2.5"
                title="Quick Log Intervention"
                @click="openIntervention(st)"
              >
                Log Int.
              </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="adminStore.filteredStudents.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">
          No students match the current search and filters.
        </p>
      </div>
      <div class="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-slate-500">Select-all applies to this page. Export includes all matching students.</p>
        <div class="flex items-center justify-between gap-3 sm:justify-end">
          <button type="button" class="btn btn-secondary text-xs" :disabled="currentPage === 1" @click="currentPage -= 1">
            Previous
          </button>
          <span class="text-xs text-slate-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button type="button" class="btn btn-secondary text-xs" :disabled="currentPage >= totalPages" @click="currentPage += 1">
            Next
          </button>
        </div>
      </div>
    </div>

    <Modal
      :is-open="showFlagModal"
      title="Set administrative risk flag"
      subtitle="Only administrators can formally classify a student's standing."
      @close="showFlagModal = false"
    >
      <form class="space-y-4" @submit.prevent="saveStudentFlag">
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">Standing category</label>
          <select v-model="flagCategory" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="Safe">Safe Standing</option>
            <option value="At Risk">At Risk / Watchlist</option>
            <option value="Critical">Critical Intervention Required</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Administrative rationale <span v-if="flagCategory !== 'Safe'" class="text-rose-600">*</span>
          </label>
          <textarea v-model="flagReason" rows="3" maxlength="300" :required="flagCategory !== 'Safe'" class="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm" :placeholder="flagCategory === 'Safe' ? 'Optional note about this classification.' : 'Required: explain why this tier is appropriate.'"></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="btn btn-secondary" @click="showFlagModal = false">Cancel</button>
          <button type="submit" class="btn btn-primary">Save risk flag</button>
        </div>
      </form>
    </Modal>

    <!-- Intervention Modal -->
    <InterventionModal
      :is-open="showInterventionModal"
      :student="selectedStudent"
      @close="showInterventionModal = false"
    />

    <!-- Bulk Notification Modal -->
    <Modal
      :is-open="showBulkMessageModal"
      title="Dispatch Bulk Notification"
      subtitle="Send message to all selected students"
      @close="showBulkMessageModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Notification Title
          </label>
          <input 
            type="text" 
            v-model="bulkTitle" 
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
            placeholder="Official Notice from Academic Cell"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Message Body
          </label>
          <textarea 
            v-model="bulkMessage" 
            rows="4"
            class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:outline-none"
            placeholder="Dear {{student_name}}, please review your upcoming milestone deadlines..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showBulkMessageModal = false">Cancel</button>
        <button type="button" class="btn btn-primary" @click="dispatchBulkNotification">Send to Selected</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAdminStore } from '../../stores/adminStore'
import { useToastStore } from '../../stores/toastStore'
import { mockDataService } from '../../services/mock/mockDataService'
import RiskBadge from '../../components/common/RiskBadge.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import InterventionModal from '../../components/modals/InterventionModal.vue'
import Modal from '../../components/common/Modal.vue'
import { Search, Download, Mail } from 'lucide-vue-next'
import { formatDate } from '../../utils/formatters'

const adminStore = useAdminStore()
const toast = useToastStore()

const showInterventionModal = ref(false)
const selectedStudent = ref(null)
const showFlagModal = ref(false)
const studentToFlag = ref(null)
const flagCategory = ref('At Risk')
const flagReason = ref('')
const showBulkMessageModal = ref(false)
const bulkTitle = ref('Academic Notice: Milestone Check')
const bulkMessage = ref('Dear {{student_name}}, please verify your registration schedule.')
const currentPage = ref(1)
const pageSize = ref(25)

const totalPages = computed(() => Math.max(1, Math.ceil(adminStore.filteredStudents.length / pageSize.value)))
const currentPageStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return adminStore.filteredStudents.slice(start, start + pageSize.value)
})
const resultStart = computed(() => adminStore.filteredStudents.length ? (currentPage.value - 1) * pageSize.value + 1 : 0)
const resultEnd = computed(() => Math.min(currentPage.value * pageSize.value, adminStore.filteredStudents.length))
const allPageStudentsSelected = computed(() => currentPageStudents.value.length > 0 &&
  currentPageStudents.value.every(student => adminStore.selectedStudentIds.includes(student.id)))

watch(
  () => [adminStore.filteredStudents, pageSize.value],
  () => { currentPage.value = 1 }
)

watch(totalPages, pageCount => {
  if (currentPage.value > pageCount) currentPage.value = pageCount
})

function getTaName(taId) {
  if (!taId) return null
  return mockDataService.getTaById(taId)?.name || null
}

function getLastIntervention(studentId) {
  const ints = mockDataService.getInterventionsForStudent(studentId)
  if (ints && ints.length > 0) {
    return `${ints[0].type} (${ints[0].outcome})`
  }
  return 'None'
}

function openIntervention(st) {
  selectedStudent.value = st
  showInterventionModal.value = true
}

function openFlagDialog(student) {
  studentToFlag.value = student
  flagCategory.value = student.riskLevel || 'At Risk'
  flagReason.value = student.flagStatus?.reason || ''
  showFlagModal.value = true
}

function saveStudentFlag() {
  if (!studentToFlag.value) return
  const updated = adminStore.flagStudent(studentToFlag.value.id, flagCategory.value, flagReason.value.trim())
  if (updated) showFlagModal.value = false
}

function flagTooltip(student) {
  const flag = student.flagStatus
  if (!flag) return ''
  const date = flag.flaggedAt ? formatDate(flag.flaggedAt) : 'date unavailable'
  return `Flagged by ${flag.flaggedBy || 'Administrator'} on ${date}. Rationale: ${flag.reason || 'Not provided'}`
}

function dispatchBulkNotification() {
  const count = mockDataService.sendBulkNotifications({
    audience: adminStore.selectedStudentIds,
    title: bulkTitle.value,
    message: bulkMessage.value,
    category: 'System'
  })
  toast.success(`Notification dispatched to ${count} selected student(s).`)
  showBulkMessageModal.value = false
  adminStore.selectedStudentIds = []
}
</script>
