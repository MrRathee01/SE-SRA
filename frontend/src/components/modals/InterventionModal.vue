<template>
  <Modal
    :is-open="isOpen"
    title="Log Academic Intervention"
    subtitle="Record a direct intervention, remedial plan, or counseling session"
    max-width="max-w-xl"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Target Student -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Student
        </label>
        <div v-if="fixedStudent" class="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
          <div>
            <div class="font-semibold text-slate-900 text-sm">{{ fixedStudent.name }}</div>
            <div class="text-xs text-slate-500">Roll No: {{ fixedStudent.rollNumber }} • Term {{ fixedStudent.termNumber }}</div>
          </div>
          <RiskBadge :level="fixedStudent.riskLevel" />
        </div>
        <select 
          v-else 
          v-model="form.studentId" 
          required 
          class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
        >
          <option value="" disabled>Select Student...</option>
          <option v-for="s in studentsList" :key="s.id" :value="s.id">
            {{ s.name }} ({{ s.rollNumber }}) — {{ s.riskLevel }}
          </option>
        </select>
      </div>

      <!-- Teaching Assistant -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Intervention Conducted By (TA)
        </label>
        <select 
          v-model="form.taId" 
          required 
          class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
        >
          <option v-for="ta in tasList" :key="ta.id" :value="ta.id">
            {{ ta.name }} ({{ ta.department }})
          </option>
        </select>
      </div>

      <!-- Intervention Type & Date -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Intervention Type
          </label>
          <select 
            v-model="form.type" 
            required
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          >
            <option value="One-on-one Session">One-on-one Session</option>
            <option value="Email">Email Communication</option>
            <option value="Study Plan Sent">Study Plan / Schedule Sent</option>
            <option value="Referral to Admin">Referral to Admin</option>
            <option value="Remedial Lab Session">Remedial Lab Session</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Date of Intervention
          </label>
          <input 
            type="date" 
            v-model="form.date" 
            required 
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          />
        </div>
      </div>

      <!-- Outcome & Follow-Up Date -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Recorded Outcome
          </label>
          <select 
            v-model="form.outcome" 
            required
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          >
            <option value="Positive Response">Positive Response</option>
            <option value="In Progress">In Progress</option>
            <option value="No Response">No Response</option>
            <option value="Escalated">Escalated to Academic Advisor</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Follow-up Target Due Date
          </label>
          <input 
            type="date" 
            v-model="form.followUpDue" 
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          />
        </div>
      </div>

      <!-- Detailed Notes -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Intervention Notes & Observations
        </label>
        <textarea 
          v-model="form.notes" 
          rows="4" 
          required
          placeholder="Describe topics covered, root causes discussed (e.g. concept gaps in calculus, OPPE test anxiety, personal delays), and commitments agreed upon..."
          class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
        ></textarea>
      </div>

      <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
        >
          Save Intervention
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Modal from '../common/Modal.vue'
import RiskBadge from '../common/RiskBadge.vue'
import { mockDataService } from '../../services/mock/mockDataService'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  student: { type: Object, default: null }
})

const emit = defineEmits(['close', 'saved'])

const studentsList = computed(() => mockDataService.getStudents())
const tasList = computed(() => mockDataService.getTas())
const fixedStudent = computed(() => props.student)

const form = ref({
  studentId: '',
  taId: 'ta-1',
  type: 'One-on-one Session',
  date: new Date().toISOString().slice(0, 10),
  outcome: 'In Progress',
  followUpDue: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  notes: ''
})

watch(() => props.student, (newVal) => {
  if (newVal) {
    form.value.studentId = newVal.id
    form.value.taId = newVal.assignedTaId || 'ta-1'
  }
}, { immediate: true })

function handleSubmit() {
  const result = mockDataService.logIntervention({
    studentId: form.value.studentId,
    taId: form.value.taId,
    type: form.value.type,
    date: form.value.date,
    outcome: form.value.outcome,
    followUpDue: form.value.followUpDue,
    notes: form.value.notes
  })
  emit('saved', result)
  emit('close')
}
</script>

