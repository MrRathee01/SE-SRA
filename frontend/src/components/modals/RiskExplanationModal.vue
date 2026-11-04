<template>
  <Modal 
    :is-open="isOpen" 
    title="Academic Risk Assessment Explanation" 
    subtitle="AI-assisted diagnostic breakdown of contributing risk signals"
    max-width="max-w-2xl"
    @close="$emit('close')"
  >
    <div v-if="student" class="space-y-6">
      <!-- Status Summary Card -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div 
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
              student.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-700' :
              student.riskLevel === 'At Risk' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            ]"
          >
            {{ student.riskScore || 65 }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-semibold text-slate-900 text-base">{{ student.name }}</h4>
              <RiskBadge :level="student.riskLevel" />
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Roll No: {{ student.rollNumber }} • {{ student.currentLevel }} • Term {{ student.termNumber }} of {{ student.totalTerms }}
            </p>
          </div>
        </div>

        <div class="text-right sm:border-l sm:border-slate-200 sm:pl-4">
          <span class="text-xs text-slate-500 block">Calculated Standing</span>
          <span class="text-sm font-semibold text-slate-800">
            {{ student.riskLevel === 'Critical' ? 'High Disengagement Risk' : student.riskLevel === 'At Risk' ? 'Progression Delay Warning' : 'Satisfactory Academic Pace' }}
          </span>
        </div>
      </div>

      <!-- Risk Factors Breakdown -->
      <div>
        <h4 class="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
          Identified Risk Factors
        </h4>
        <div v-if="student.riskFactors && student.riskFactors.length > 0" class="space-y-2.5">
          <div 
            v-for="(rf, idx) in student.riskFactors" 
            :key="idx"
            class="p-3.5 rounded-xl border border-slate-200/90 bg-white flex items-start justify-between gap-3 shadow-xs"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-slate-900">{{ rf.factor }}</span>
                <span 
                  :class="[
                    'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                    rf.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                    rf.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  ]"
                >
                  {{ rf.severity }}
                </span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">{{ rf.detail }}</p>
            </div>
            <span v-if="rf.impact" class="text-xs font-semibold text-slate-500 shrink-0 bg-slate-50 px-2 py-1 rounded">
              {{ rf.impact }}
            </span>
          </div>
        </div>
        <div v-else class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-sm">
          No significant risk factors detected! The student is maintaining expected milestone progress.
        </div>
      </div>

      <!-- Recommended Actions -->
      <div>
        <h4 class="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
          Recommended Next Steps
        </h4>
        <ul class="space-y-2">
          <li 
            v-for="(action, i) in student.recommendedActions || []" 
            :key="i"
            class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200"
          >
            <span class="w-5 h-5 rounded-full bg-navy-100 text-navy-800 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
              {{ i + 1 }}
            </span>
            <span>{{ action }}</span>
          </li>
        </ul>
      </div>

      <!-- Simulated AI Note -->
      <div class="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
        <svg class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          <strong>Simulated Diagnostic Assessment:</strong> Risk status is synthesized from milestone pacing (4-in-4, 6-in-6), assignment engagement, OPPE attempts, and course repeat counts. Individual intervention plans should be confirmed by assigned Teaching Assistants.
        </p>
      </div>
    </div>

    <template #footer>
      <button 
        type="button" 
        class="btn btn-secondary"
        @click="$emit('close')"
      >
        Close
      </button>
      <button 
        v-if="ctaAction" 
        type="button" 
        class="btn btn-primary"
        @click="$emit('action'); $emit('close')"
      >
        {{ ctaLabel }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '../common/Modal.vue'
import RiskBadge from '../common/RiskBadge.vue'

defineProps({
  isOpen: { type: Boolean, default: false },
  student: { type: Object, default: null },
  ctaLabel: { type: String, default: 'Request Mentorship' },
  ctaAction: { type: Boolean, default: true }
})

defineEmits(['close', 'action'])
</script>

