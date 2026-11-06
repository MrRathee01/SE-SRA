<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Program Intervention Tracking & Surveillance</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Program-wide audit of faculty/TA interventions, outcome efficacy rates, and overdue follow-up reminders.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button 
          type="button" 
          class="btn btn-primary text-xs"
          @click="showLogModal = true"
        >
          <PlusCircle class="w-3.5 h-3.5 mr-1.5" />
          Log Direct Intervention
        </button>
      </div>
    </div>

    <!-- Outcome Analytics Chart & Overdue Follow-ups Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Outcome Breakdown Doughnut / Bar -->
      <div class="card p-6 flex flex-col justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 mb-1">Intervention Outcome Resolution</h3>
          <p class="text-xs text-slate-500 mb-4">Percentage breakdown of recorded student responses.</p>
          <div class="h-52">
            <DoughnutChart :chart-data="outcomeChartData" />
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-center">
          <div class="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <span class="text-emerald-800 font-bold text-base block">{{ interventionStore.outcomeStats.positivePct }}%</span>
            <span class="text-emerald-700 text-[11px]">Positive Response</span>
          </div>
          <div class="p-2 bg-rose-50 rounded-lg border border-rose-200">
            <span class="text-rose-800 font-bold text-base block">{{ interventionStore.outcomeStats.escalatedPct + interventionStore.outcomeStats.noResponsePct }}%</span>
            <span class="text-rose-700 text-[11px]">Unresolved / Escalated</span>
          </div>
        </div>
      </div>

      <!-- Overdue Follow-Ups Panel (>7 days without logged outcome) -->
      <div class="card p-6 lg:col-span-2 flex flex-col justify-between border-l-4 border-l-rose-500">
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-slate-900">Overdue Follow-Up Surveillance</h3>
              <span class="badge badge-critical">&gt; 7 Days Pending</span>
            </div>
            <span class="text-xs text-rose-700 font-bold">
              {{ interventionStore.overdueFollowUps.length }} Interventions Overdue
            </span>
          </div>
          <p class="text-xs text-slate-500 mb-4">
            Interventions where an initial touchpoint was held, but no final resolution outcome has been submitted within 7 days.
          </p>

          <div class="space-y-3 max-h-56 overflow-y-auto pr-1">
            <div 
              v-for="item in interventionStore.overdueFollowUps" 
              :key="item.id"
              class="p-3 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900 text-sm">{{ item.studentName }}</span>
                  <span class="text-slate-500">({{ item.rollNumber }})</span>
                  <span class="text-rose-700 font-semibold">• Assigned to {{ item.taName }}</span>
                </div>
                <p class="text-slate-600 mt-0.5">{{ item.type }} logged on {{ formatDate(item.date) }}</p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button 
                  type="button" 
                  class="btn btn-warning text-xs py-1 px-3 font-semibold shadow-xs"
                  @click="interventionStore.remindTa(item.id)"
                >
                  <Bell class="w-3 h-3 mr-1" />
                  Remind TA
                </button>
                <button 
                  type="button" 
                  class="btn btn-secondary text-xs py-1 px-2.5"
                  @click="openOutcomeModal(item)"
                >
                  Update Outcome
                </button>
              </div>
            </div>

            <div v-if="interventionStore.overdueFollowUps.length === 0" class="text-center py-6 text-slate-400 text-xs">
              No overdue follow-ups! All interventions have recent outcomes logged.
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Clicking 'Remind TA' fires an urgent notification to the TA's inbox.</span>
        </div>
      </div>
    </div>

    <!-- Intervention Log Table -->
    <div class="card p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Program-Wide Intervention Ledger</h3>
          <p class="text-xs text-slate-500 mt-0.5">Filter by outcome, teaching assistant, or student</p>
        </div>

        <!-- Filter controls -->
        <div class="flex items-center gap-2 flex-wrap">
          <input 
            v-model="interventionStore.searchQuery"
            type="text" 
            placeholder="Search student, TA, or notes..."
            class="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none"
          />

          <select 
            v-model="interventionStore.filterOutcome"
            class="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Positive Response">Positive Response</option>
            <option value="In Progress">In Progress</option>
            <option value="No Response">No Response</option>
            <option value="Escalated">Escalated</option>
          </select>

          <select 
            v-model="interventionStore.filterTaId"
            class="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none"
          >
            <option value="ALL">All TAs</option>
            <option v-for="ta in adminStore.allTas" :key="ta.id" :value="ta.id">
              {{ ta.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-header">Student</th>
              <th class="table-header">Conducted By (TA)</th>
              <th class="table-header">Type</th>
              <th class="table-header">Date</th>
              <th class="table-header">Outcome</th>
              <th class="table-header">Notes & Summary</th>
              <th class="table-header">Follow-up Due</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="item in interventionStore.filteredInterventions" 
              :key="item.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="table-cell">
                <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ item.studentName }}</div>
                <div class="text-[11px] text-slate-400">{{ item.rollNumber }}</div>
              </td>
              <td class="table-cell text-xs font-medium text-navy-800">
                {{ item.taName }}
              </td>
              <td class="table-cell text-xs text-slate-700">
                {{ item.type }}
              </td>
              <td class="table-cell text-xs text-slate-500">
                {{ formatDate(item.date) }}
              </td>
              <td class="table-cell">
                <StatusBadge :status="item.outcome" />
              </td>
              <td class="table-cell max-w-xs text-xs text-slate-600 truncate" :title="item.notes">
                {{ item.notes }}
              </td>
              <td class="table-cell text-xs text-slate-500">
                {{ formatDate(item.followUpDue) }}
              </td>
              <td class="table-cell text-right space-x-1.5 whitespace-nowrap">
                <button 
                  type="button" 
                  class="btn btn-secondary text-xs py-1 px-2"
                  @click="openOutcomeModal(item)"
                >
                  Update
                </button>
                <router-link 
                  :to="`/admin/students/${item.studentId}`" 
                  class="btn btn-primary text-xs py-1 px-2"
                >
                  Profile
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Intervention Modal (Create) -->
    <InterventionModal
      :is-open="showLogModal"
      @close="showLogModal = false"
    />

    <!-- Outcome Update Modal -->
    <Modal
      :is-open="showUpdateModal"
      title="Update Intervention Outcome"
      subtitle="Update result and notes for this intervention"
      @close="showUpdateModal = false"
    >
      <div v-if="selectedIntervention" class="space-y-4 text-xs">
        <div>
          <span class="text-slate-400 block uppercase font-semibold">Student & TA</span>
          <span class="font-bold text-slate-900 text-sm">{{ selectedIntervention.studentName }} • {{ selectedIntervention.taName }}</span>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 uppercase mb-1">Outcome Status</label>
          <select 
            v-model="updateForm.outcome"
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="Positive Response">Positive Response</option>
            <option value="In Progress">In Progress</option>
            <option value="No Response">No Response</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 uppercase mb-1">Additional Outcome Notes</label>
          <textarea 
            v-model="updateForm.notes"
            rows="3"
            class="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none"
            placeholder="Add follow-up notes..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showUpdateModal = false">Cancel</button>
        <button type="button" class="btn btn-primary" @click="saveUpdatedOutcome">Save Update</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInterventionStore } from '../../stores/interventionStore'
import { useAdminStore } from '../../stores/adminStore'
import DoughnutChart from '../../components/charts/DoughnutChart.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import InterventionModal from '../../components/modals/InterventionModal.vue'
import Modal from '../../components/common/Modal.vue'
import { formatDate } from '../../utils/formatters'
import { PlusCircle, Bell } from 'lucide-vue-next'

const interventionStore = useInterventionStore()
const adminStore = useAdminStore()

const showLogModal = ref(false)
const showUpdateModal = ref(false)
const selectedIntervention = ref(null)

const updateForm = ref({
  outcome: 'Positive Response',
  notes: ''
})

const outcomeChartData = computed(() => {
  const stats = interventionStore.outcomeStats
  return {
    labels: ['Positive', 'In Progress', 'No Response', 'Escalated'],
    datasets: [
      {
        data: [stats.positive, stats.inProgress, stats.noResponse, stats.escalated],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }
    ]
  }
})

function openOutcomeModal(item) {
  selectedIntervention.value = item
  updateForm.value = { outcome: item.outcome, notes: '' }
  showUpdateModal.value = true
}

function saveUpdatedOutcome() {
  if (selectedIntervention.value) {
    interventionStore.updateOutcome(
      selectedIntervention.value.id,
      updateForm.value.outcome,
      updateForm.value.notes
    )
  }
  showUpdateModal.value = false
}
</script>

