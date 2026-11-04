<template>
  <Modal
    :is-open="adminStore.isAssignmentWizardOpen"
    title="Assign Teaching Assistant"
    :subtitle="`Step ${adminStore.wizardStep} of 4: ${stepTitle}`"
    max-width="max-w-2xl"
    @close="adminStore.closeAssignmentWizard"
  >
    <div v-if="adminStore.wizardTargetStudent">
      <!-- Step 1: Student Summary -->
      <div v-if="adminStore.wizardStep === 1" class="space-y-4">
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start justify-between">
          <div class="flex items-center gap-3">
            <img 
              :src="adminStore.wizardTargetStudent.avatar" 
              class="w-12 h-12 rounded-full object-cover border border-slate-300" 
              alt="Student"
            />
            <div>
              <h4 class="font-semibold text-slate-900 text-base">{{ adminStore.wizardTargetStudent.name }}</h4>
              <p class="text-xs text-slate-500">
                Roll No: {{ adminStore.wizardTargetStudent.rollNumber }} • Term {{ adminStore.wizardTargetStudent.termNumber }} • {{ adminStore.wizardTargetStudent.currentLevel }}
              </p>
            </div>
          </div>
          <RiskBadge :level="adminStore.wizardTargetStudent.riskLevel" />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3 bg-white border border-slate-200 rounded-lg text-center">
            <span class="text-xs text-slate-500 block">Risk Score</span>
            <span class="text-lg font-bold text-slate-900">{{ adminStore.wizardTargetStudent.riskScore || 70 }}/100</span>
          </div>
          <div class="p-3 bg-white border border-slate-200 rounded-lg text-center">
            <span class="text-xs text-slate-500 block">Foundation Met</span>
            <span class="text-lg font-bold text-slate-900">{{ adminStore.wizardTargetStudent.foundationCompleted || 4 }}/8</span>
          </div>
          <div class="p-3 bg-white border border-slate-200 rounded-lg text-center">
            <span class="text-xs text-slate-500 block">Pending Tasks</span>
            <span class="text-lg font-bold text-slate-900">{{ (adminStore.wizardTargetStudent.assignmentsPendingCount || 0) + (adminStore.wizardTargetStudent.quizzesPendingCount || 0) }}</span>
          </div>
          <div class="p-3 bg-white border border-slate-200 rounded-lg text-center">
            <span class="text-xs text-slate-500 block">Current TA</span>
            <span class="text-xs font-semibold text-slate-800 truncate block mt-1">
              {{ currentTaName }}
            </span>
          </div>
        </div>

        <!-- Primary Reason for Flag -->
        <div class="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
          <span class="text-xs font-bold text-amber-800 uppercase tracking-wide block mb-1">Primary Academic Concern</span>
          <p class="text-sm text-amber-900">
            {{ adminStore.wizardTargetStudent.riskFactors?.[0]?.detail || 'Student approaching critical milestone boundary; requires dedicated mentorship.' }}
          </p>
        </div>
      </div>

      <!-- Step 2: Available TA Selection -->
      <div v-else-if="adminStore.wizardStep === 2" class="space-y-4">
        <div class="text-xs text-slate-500 flex items-center justify-between">
          <span>Select a Teaching Assistant from the available cohort:</span>
          <span class="text-navy-700 font-medium">✨ AI Match Active</span>
        </div>

        <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
          <div 
            v-for="ta in sortedTasWithRecommendation" 
            :key="ta.id"
            :class="[
              'p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3',
              adminStore.wizardSelectedTaId === ta.id 
                ? 'border-navy-600 bg-navy-50/50 ring-2 ring-navy-600' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            ]"
            @click="adminStore.wizardSelectedTaId = ta.id"
          >
            <div class="flex items-start gap-3">
              <input 
                type="radio" 
                name="selectedTa" 
                :value="ta.id" 
                v-model="adminStore.wizardSelectedTaId"
                class="mt-1 text-navy-800 focus:ring-navy-600"
              />
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-900 text-sm">{{ ta.name }}</span>
                  <span 
                    v-if="ta.isRecommended" 
                    class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                  >
                    Recommended Match
                  </span>
                </div>
                <p class="text-xs text-slate-500">{{ ta.department }}</p>
                <div class="flex flex-wrap gap-1 mt-1.5">
                  <span 
                    v-for="exp in ta.expertise" 
                    :key="exp"
                    class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                  >
                    {{ exp }}
                  </span>
                </div>
              </div>
            </div>

            <div class="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 sm:border-l sm:pl-3">
              <div class="text-xs text-slate-500">Student Load</div>
              <div class="font-bold text-sm text-slate-800">
                {{ ta.assignedCount }} / {{ ta.maxCapacity || 25 }}
              </div>
              <div class="text-[11px] text-amber-600 font-medium">
                {{ ta.atRiskCount }} at-risk
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Optional Message to TA -->
      <div v-else-if="adminStore.wizardStep === 3" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Guidance Note for Teaching Assistant (Optional)
          </label>
          <textarea 
            v-model="adminStore.wizardMessage" 
            rows="5"
            class="w-full text-sm border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
            placeholder="Specify any focus areas, recommended meeting schedule, or remedial objectives..."
          ></textarea>
          <p class="text-xs text-slate-500 mt-1">
            This message will be dispatched directly in the assignment alert to {{ selectedTaObject?.name }}.
          </p>
        </div>
      </div>

      <!-- Step 4: Confirmation -->
      <div v-else-if="adminStore.wizardStep === 4" class="space-y-4">
        <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
          <div class="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
            <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Review Assignment Details
          </div>

          <div class="text-xs text-slate-700 space-y-2 pt-2 border-t border-emerald-200">
            <div><strong>Student:</strong> {{ adminStore.wizardTargetStudent.name }} ({{ adminStore.wizardTargetStudent.rollNumber }})</div>
            <div><strong>Assigned TA:</strong> {{ selectedTaObject?.name }} ({{ selectedTaObject?.department }})</div>
            <div><strong>Special Note:</strong> {{ adminStore.wizardMessage || 'None specified' }}</div>
          </div>
        </div>

        <p class="text-xs text-slate-500">
          Upon clicking confirm, notifications will be automatically triggered to both the student and the Teaching Assistant, and an entry will be logged into the student's historical intervention ledger.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <button 
          v-if="adminStore.wizardStep > 1"
          type="button" 
          class="btn btn-secondary"
          @click="adminStore.wizardStep--"
        >
          Back
        </button>
        <span v-else></span>

        <div class="flex items-center gap-2">
          <button 
            type="button" 
            class="btn btn-secondary"
            @click="adminStore.closeAssignmentWizard"
          >
            Cancel
          </button>

          <button 
            v-if="adminStore.wizardStep < 4"
            type="button" 
            class="btn btn-primary"
            @click="adminStore.wizardStep++"
          >
            Next Step
          </button>

          <button 
            v-else
            type="button" 
            class="btn btn-primary bg-emerald-700 hover:bg-emerald-800"
            @click="adminStore.confirmAssignment"
          >
            Confirm & Assign TA
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '../common/Modal.vue'
import RiskBadge from '../common/RiskBadge.vue'
import { useAdminStore } from '../../stores/adminStore'
import { mockDataService } from '../../services/mock/mockDataService'

const adminStore = useAdminStore()

const stepTitle = computed(() => {
  switch (adminStore.wizardStep) {
    case 1: return 'Student Summary'
    case 2: return 'Select Available TA'
    case 3: return 'Optional Guidance Message'
    case 4: return 'Confirm Assignment'
    default: return ''
  }
})

const currentTaName = computed(() => {
  if (!adminStore.wizardTargetStudent?.assignedTaId) return 'None'
  const ta = mockDataService.getTaById(adminStore.wizardTargetStudent.assignedTaId)
  return ta ? ta.name : 'None'
})

const selectedTaObject = computed(() => {
  if (!adminStore.wizardSelectedTaId) return null
  return mockDataService.getTaById(adminStore.wizardSelectedTaId)
})

const sortedTasWithRecommendation = computed(() => {
  const tas = mockDataService.getTas()
  // Pick recommended TA (lowest load)
  const minLoad = Math.min(...tas.map(t => t.assignedCount))
  return tas.map(t => ({
    ...t,
    isRecommended: t.assignedCount === minLoad
  }))
})
</script>

