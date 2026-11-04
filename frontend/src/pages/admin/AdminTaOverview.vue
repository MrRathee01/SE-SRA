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

    <!-- Workload Balance Bar Chart & Overload Alerts -->
    <div class="card p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 class="text-base font-bold text-slate-900">TA Workload & At-Risk Distribution</h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Total assigned students vs high-risk caseload. Configured overload ceiling: <strong>{{ overloadThreshold }} students</strong>.
          </p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-navy-800"></span> Total Assigned</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-500"></span> At-Risk Count</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-rose-500"></span> Overload Limit</span>
        </div>
      </div>

      <div class="h-64">
        <BarChart :chart-data="workloadChartData" />
      </div>

      <!-- Overload Banner if any TA exceeds threshold -->
      <div 
        v-if="overloadedTas.length > 0"
        class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-900"
      >
        <div class="flex items-center gap-2 font-semibold">
          <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
          <span>Capacity Warning: {{ overloadedTas.map(t => t.name).join(', ') }} exceeded maximum workload limit ({{ overloadThreshold }} students).</span>
        </div>
        <button 
          type="button" 
          class="btn btn-danger text-[11px] py-1 px-2.5 font-bold shrink-0"
          @click="$router.push('/admin/students')"
        >
          Rebalance Assignments
        </button>
      </div>
    </div>

    <!-- TA Roster Table -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Teaching Assistant Directory</h3>
          <p class="text-xs text-slate-500 mt-0.5">Click any TA row to inspect assigned students and logged intervention history.</p>
        </div>

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

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-header">Teaching Assistant</th>
              <th class="table-header">Department / Specialization</th>
              <th class="table-header">Assigned Students</th>
              <th class="table-header">At-Risk Caseload</th>
              <th class="table-header">Open Interventions</th>
              <th class="table-header">Last Active</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="ta in adminStore.filteredTas" 
              :key="ta.id"
              class="hover:bg-slate-50 transition-colors cursor-pointer"
              @click="openTaDetail(ta)"
            >
              <td class="table-cell">
                <div class="flex items-center gap-3">
                  <img :src="ta.avatar" class="w-9 h-9 rounded-full object-cover border border-slate-200" alt="" />
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
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-xs text-slate-900">{{ ta.assignedCount }}</span>
                  <span 
                    v-if="ta.assignedCount >= overloadThreshold" 
                    class="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded"
                  >
                    Overloaded
                  </span>
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
                <button 
                  type="button" 
                  class="btn btn-secondary text-xs py-1 px-2.5"
                  @click="openTaDetail(ta)"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
          <h4 class="font-bold text-sm text-slate-900 mb-2">Assigned Student Roster</h4>
          <div class="space-y-2 max-h-52 overflow-y-auto pr-1">
            <div 
              v-for="st in taAssignedStudents" 
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
        </div>

        <!-- Logged Interventions by this TA -->
        <div>
          <h4 class="font-bold text-sm text-slate-900 mb-2">Logged Interventions by this TA</h4>
          <div class="space-y-2 max-h-52 overflow-y-auto pr-1">
            <div 
              v-for="int in taInterventions" 
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
import { ref, computed } from 'vue'
import { useAdminStore } from '../../stores/adminStore'
import { useToastStore } from '../../stores/toastStore'
import { mockDataService } from '../../services/mock/mockDataService'
import BarChart from '../../components/charts/BarChart.vue'
import RiskBadge from '../../components/common/RiskBadge.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import Modal from '../../components/common/Modal.vue'
import { formatRelativeTime } from '../../utils/formatters'
import { UserPlus, AlertCircle, Search } from 'lucide-vue-next'

const adminStore = useAdminStore()
const toast = useToastStore()

const overloadThreshold = computed(() => adminStore.taWorkloadThreshold || 22)
const showDetailModal = ref(false)
const selectedTa = ref(null)

const showAddTaModal = ref(false)
const newTaForm = ref({
  name: '',
  email: '',
  department: 'Computer Science & Engineering',
  expertiseStr: 'Programming in Python, PDSA',
  maxCapacity: 25
})

const overloadedTas = computed(() => {
  return adminStore.allTas.filter(t => t.assignedCount >= overloadThreshold.value)
})

const workloadChartData = computed(() => {
  const tas = adminStore.allTas
  return {
    labels: tas.map(t => t.name.split(' ')[0] + ' ' + (t.name.split(' ')[1]?.[0] || '') + '.'),
    datasets: [
      {
        label: 'Total Students Assigned',
        data: tas.map(t => t.assignedCount),
        backgroundColor: '#1e3757',
        borderRadius: 4
      },
      {
        label: 'At-Risk Students',
        data: tas.map(t => t.atRiskCount),
        backgroundColor: '#f59e0b',
        borderRadius: 4
      }
    ]
  }
})

function openTaDetail(ta) {
  selectedTa.value = ta
  showDetailModal.value = true
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
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98409 00000',
    bio: 'Academic staff assistant.'
  }
  mockDataService.tas.push(newTa)
  mockDataService.saveAll()
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

