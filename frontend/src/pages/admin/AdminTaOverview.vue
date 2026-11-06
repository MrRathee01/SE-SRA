<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Teaching Assistant Workload & Capacity Management</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Surveillance of TA student distribution, at-risk caseload balance, and pending intervention logs.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button 
          type="button" 
          class="btn btn-primary text-xs"
          @click="showAddTaModal = true"
        >
          <UserPlus class="w-3.5 h-3.5 mr-1.5" />
          Add Teaching Assistant
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div class="card p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">TA pool</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">{{ adminStore.allTas.length }}</p>
        <p class="mt-1 text-xs text-slate-500">Registered teaching assistants</p>
      </div>
      <div class="card p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Average caseload</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">{{ averageCaseload }}</p>
        <p class="mt-1 text-xs text-slate-500">Assigned students per TA</p>
      </div>
      <div class="card p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Near / over capacity</p>
        <p class="mt-1 text-2xl font-bold" :class="nearCapacityTas ? 'text-amber-700' : 'text-emerald-700'">{{ nearCapacityTas }}</p>
        <p class="mt-1 text-xs text-slate-500">At least 80% of available capacity</p>
      </div>
    </div>

    <!-- TA Roster Table -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Teaching Assistant Directory</h3>
          <p class="text-xs text-slate-500 mt-0.5" aria-live="polite">
            Showing {{ resultStart }}–{{ resultEnd }} of {{ adminStore.filteredTas.length }} teaching assistants. Click a row for details.
          </p>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label class="flex items-center gap-2 text-xs text-slate-600">
            Rows per page
            <select v-model.number="pageSize" class="rounded-lg border border-slate-300 bg-white px-2 py-1.5">
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </label>
          <div class="relative max-w-xs w-full">
          <input
            v-model="adminStore.taSearchQuery"
            type="text" 
            placeholder="Search TA by name or subject..."
            class="w-full text-xs border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 bg-white focus:outline-none"
          />
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-header">Teaching Assistant</th>
              <th class="table-header">Department / Specialization</th>
              <th class="table-header">Caseload & Capacity</th>
              <th class="table-header">At-Risk Caseload</th>
              <th class="table-header">Open Interventions</th>
              <th class="table-header">Last Active</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="ta in currentPageTas"
              :key="ta.id"
              class="hover:bg-slate-50 transition-colors cursor-pointer"
              @click="openTaDetail(ta)"
            >
              <td class="table-cell">
                <div class="flex items-center gap-3">
                  <InitialsAvatar :name="ta.name" role="ta" size="sm" />
                  <div>
                    <div class="font-bold text-slate-900 text-xs sm:text-sm hover:underline">{{ ta.name }}</div>
                    <div class="text-[11px] text-slate-400">{{ ta.email }}</div>
                  </div>
                </div>
              </td>
              <td class="table-cell text-xs text-slate-700">
                <div class="font-medium text-slate-800">{{ ta.department }}</div>
                <div class="text-[10px] text-slate-400 truncate max-w-xs">{{ ta.expertise?.join(', ') }}</div>
              </td>
              <td class="table-cell min-w-48">
                <div class="mb-1.5 flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-800">{{ ta.assignedCount }} / {{ ta.maxCapacity || 25 }} students</span>
                  <span :class="['rounded-full px-2 py-0.5 text-[10px] font-semibold', capacityStatusClass(ta)]">
                    {{ capacityStatus(ta) }}
                  </span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div :class="['h-full rounded-full', capacityMeterClass(ta)]" :style="{ width: `${capacityPercent(ta)}%` }"></div>
                </div>
              </td>
              <td class="table-cell">
                <span 
                  :class="[
                    'text-xs font-bold px-2 py-0.5 rounded',
                    ta.atRiskCount > 5 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  ]"
                >
                  {{ ta.atRiskCount }} Students
                </span>
              </td>
              <td class="table-cell text-xs font-bold text-slate-800">
                {{ ta.openInterventions }}
              </td>
              <td class="table-cell text-xs text-slate-500">
                {{ formatRelativeTime(ta.lastActive) }}
              </td>
              <td class="table-cell text-right" @click.stop>
                <div class="flex justify-end gap-1.5">
                  <button
                    type="button"
                    class="btn btn-secondary text-xs py-1 px-2.5"
                    @click="openTaDetail(ta)"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary text-xs py-1 px-2.5"
                    @click="openRebalance(ta)"
                  >
                    Rebalance
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="adminStore.filteredTas.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">
          No teaching assistants match this search.
        </p>
      </div>
      <div class="mt-4 flex justify-end">
        <div class="flex items-center gap-3">
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

    <!-- TA Detail Modal (Assigned students & Interventions) -->
    <Modal
      :is-open="showDetailModal"
      :title="selectedTa?.name || 'TA Detail'"
      :subtitle="`${selectedTa?.department} • ${selectedTa?.email}`"
      max-width="max-w-3xl"
      @close="showDetailModal = false"
    >
      <div v-if="selectedTa" class="space-y-6 text-xs">
        <!-- Overview summary -->
        <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Total Students</span>
            <span class="text-base font-bold text-slate-900">{{ selectedTa.assignedCount }} / {{ selectedTa.maxCapacity || 25 }}</span>
          </div>
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">At-Risk Students</span>
            <span class="text-base font-bold text-amber-600">{{ selectedTa.atRiskCount }}</span>
          </div>
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Specialization</span>
            <span class="text-xs font-medium text-slate-800">{{ selectedTa.expertise?.join(', ') }}</span>
          </div>
        </div>

        <!-- Assigned Students List -->
        <div>
          <div class="mb-2 flex items-center justify-between gap-3">
            <h4 class="font-bold text-sm text-slate-900">Assigned Student Roster</h4>
            <span class="text-[11px] text-slate-500">{{ taAssignedStudents.length }} total</span>
          </div>
          <div class="space-y-2 max-h-52 overflow-y-auto pr-1">
            <div 
              v-for="st in taAssignedStudents.slice(0, 10)"
              :key="st.id"
              class="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
            >
              <div>
                <span class="font-bold text-slate-900">{{ st.name }}</span>
                <span class="text-slate-400 text-[11px] ml-2">({{ st.rollNumber }} • Term {{ st.termNumber }})</span>
              </div>
              <RiskBadge :level="st.riskLevel" />
            </div>
            <div v-if="taAssignedStudents.length === 0" class="text-slate-400 text-center py-4">
              No students assigned.
            </div>
          </div>
          <button
            v-if="taAssignedStudents.length > 10"
            type="button"
            class="mt-2 text-xs font-semibold text-navy-700 hover:text-navy-900"
            @click="openAssignedStudents"
          >
            View all {{ taAssignedStudents.length }} assigned students →
          </button>
        </div>

        <!-- Logged Interventions by this TA -->
        <div>
          <div class="mb-2 flex items-center justify-between gap-3">
            <h4 class="font-bold text-sm text-slate-900">Logged Interventions by this TA</h4>
            <span class="text-[11px] text-slate-500">{{ taInterventions.length }} total</span>
          </div>
          <div class="space-y-2 max-h-52 overflow-y-auto pr-1">
            <div 
              v-for="int in taInterventions.slice(0, 10)"
              :key="int.id"
              class="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1"
            >
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-900">{{ int.type }} with {{ int.studentName }}</span>
                <StatusBadge :status="int.outcome" />
              </div>
              <p class="text-slate-600 text-[11px]">{{ int.notes }}</p>
            </div>
            <div v-if="taInterventions.length === 0" class="text-slate-400 text-center py-4">
              No interventions logged yet.
            </div>
          </div>
          <button
            v-if="taInterventions.length > 10"
            type="button"
            class="mt-2 text-xs font-semibold text-navy-700 hover:text-navy-900"
            @click="showDetailModal = false; router.push('/admin/interventions')"
          >
            View intervention tracking →
          </button>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showDetailModal = false">Close</button>
      </template>
    </Modal>

    <!-- Add TA Modal -->
    <Modal
      :is-open="showAddTaModal"
      title="Add New Teaching Assistant"
      subtitle="Register faculty or senior student TA to the pool"
      @close="showAddTaModal = false"
    >
      <form @submit.prevent="saveNewTa" class="space-y-4 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 uppercase mb-1">Full Name</label>
          <input 
            type="text" 
            v-model="newTaForm.name" 
            required 
            placeholder="e.g. Dr. Ramesh Kumar"
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 uppercase mb-1">Academic Email</label>
          <input 
            type="email" 
            v-model="newTaForm.email" 
            required 
            placeholder="ramesh.k@ta.iitm.ac.in"
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 uppercase mb-1">Department</label>
          <input 
            type="text" 
            v-model="newTaForm.department" 
            required 
            placeholder="e.g. Computer Science"
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 uppercase mb-1">Expertise Courses (Comma-separated)</label>
          <input 
            type="text" 
            v-model="newTaForm.expertiseStr" 
            required 
            placeholder="Programming in Python, DBMS, Math I"
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 uppercase mb-1">Max Student Capacity</label>
          <input 
            type="number" 
            v-model.number="newTaForm.maxCapacity" 
            min="5" 
            max="50" 
            required
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn btn-secondary" @click="showAddTaModal = false">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Teaching Assistant</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/adminStore'
import { useToastStore } from '../../stores/toastStore'
import { mockDataService } from '../../services/mock/mockDataService'
import RiskBadge from '../../components/common/RiskBadge.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import Modal from '../../components/common/Modal.vue'
import { formatRelativeTime } from '../../utils/formatters'
import { UserPlus, Search } from 'lucide-vue-next'

const adminStore = useAdminStore()
const toast = useToastStore()
const router = useRouter()

const showDetailModal = ref(false)
const selectedTa = ref(null)
const currentPage = ref(1)
const pageSize = ref(25)

const showAddTaModal = ref(false)
const newTaForm = ref({
  name: '',
  email: '',
  department: 'Computer Science & Engineering',
  expertiseStr: 'Programming in Python, PDSA',
  maxCapacity: 25
})

const averageCaseload = computed(() => {
  const tas = adminStore.allTas
  if (!tas.length) return 0
  return Math.round(tas.reduce((total, ta) => total + ta.assignedCount, 0) / tas.length)
})

const nearCapacityTas = computed(() => adminStore.allTas.filter(ta => capacityPercent(ta) >= 80).length)
const totalPages = computed(() => Math.max(1, Math.ceil(adminStore.filteredTas.length / pageSize.value)))
const currentPageTas = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return adminStore.filteredTas.slice(start, start + pageSize.value)
})
const resultStart = computed(() => adminStore.filteredTas.length ? (currentPage.value - 1) * pageSize.value + 1 : 0)
const resultEnd = computed(() => Math.min(currentPage.value * pageSize.value, adminStore.filteredTas.length))

watch(
  () => [adminStore.taSearchQuery, pageSize.value],
  () => { currentPage.value = 1 }
)

watch(totalPages, pageCount => {
  if (currentPage.value > pageCount) currentPage.value = pageCount
})

function capacityPercent(ta) {
  return Math.min(100, Math.round((ta.assignedCount / (ta.maxCapacity || 25)) * 100))
}

function capacityStatus(ta) {
  const percent = capacityPercent(ta)
  if (percent >= 100) return 'Overloaded'
  if (percent >= 80) return 'Near limit'
  return 'Optimal'
}

function capacityStatusClass(ta) {
  const percent = capacityPercent(ta)
  if (percent >= 100) return 'bg-rose-50 text-rose-700'
  if (percent >= 80) return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

function capacityMeterClass(ta) {
  const percent = capacityPercent(ta)
  if (percent >= 100) return 'bg-rose-500'
  if (percent >= 80) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function openTaDetail(ta) {
  selectedTa.value = ta
  showDetailModal.value = true
}

function openRebalance(ta) {
  adminStore.filterAssignedTa = ta.id
  adminStore.studentActiveTab = 'ALL'
  adminStore.studentSearchQuery = ''
  adminStore.filterLevel = 'ALL'
  adminStore.filterTerm = 'ALL'
  router.push('/admin/students')
}

function openAssignedStudents() {
  if (!selectedTa.value) return
  adminStore.filterAssignedTa = selectedTa.value.id
  adminStore.studentActiveTab = 'ALL'
  adminStore.studentSearchQuery = ''
  adminStore.filterLevel = 'ALL'
  adminStore.filterTerm = 'ALL'
  showDetailModal.value = false
  router.push('/admin/students')
}

const taAssignedStudents = computed(() => {
  if (!selectedTa.value) return []
  return mockDataService.getStudents().filter(s => s.assignedTaId === selectedTa.value.id)
})

const taInterventions = computed(() => {
  if (!selectedTa.value) return []
  return mockDataService.getInterventionsForTa(selectedTa.value.id)
})

function saveNewTa() {
  const newTa = {
    id: `ta-${Date.now()}`,
    name: newTaForm.value.name,
    email: newTaForm.value.email,
    role: 'Teaching Assistant',
    department: newTaForm.value.department,
    expertise: newTaForm.value.expertiseStr.split(',').map(s => s.trim()),
    assignedCount: 0,
    atRiskCount: 0,
    openInterventions: 0,
    maxCapacity: newTaForm.value.maxCapacity,
    lastActive: new Date().toISOString(),
    phone: '+91 98409 00000',
    bio: 'Academic staff assistant.'
  }
  mockDataService.tas.push(newTa)
  mockDataService.saveAll()
  adminStore.refreshData()
  toast.success(`Teaching Assistant ${newTa.name} added successfully!`)
  showAddTaModal.value = false
  newTaForm.value = {
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    expertiseStr: 'Programming in Python, PDSA',
    maxCapacity: 25
  }
}
</script>
