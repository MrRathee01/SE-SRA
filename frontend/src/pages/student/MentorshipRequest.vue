<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5">
      <h2 class="text-xl font-bold text-slate-900">Academic Mentorship & Guidance Request</h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Formally submit requests for 1-on-1 tutoring, OPPE exam preparation, or degree planning support to the Academic Coordination Cell.
      </p>
    </div>

    <div v-if="studentStore.assignedTa" class="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Your assigned TA</p>
        <p class="mt-1 text-sm font-bold text-slate-900">{{ studentStore.assignedTa.name }}</p>
      </div>
      <div class="text-xs text-slate-600 sm:text-right">
        <p class="font-semibold text-slate-700">Consultation availability · {{ consultationFrequency.toLowerCase() }}</p>
        <p class="mt-1">
          {{ studentStore.assignedTa.schedulePreferences?.days?.join(', ') || 'Please contact your TA to confirm available days' }}
          <span v-if="studentStore.assignedTa.schedulePreferences?.slots?.length"> · {{ studentStore.assignedTa.schedulePreferences.slots.join(', ') }}</span>
        </p>
      </div>
    </div>

    <!-- Active Request Status Tracker (if pending or in-progress) -->
    <div v-if="activeRequest" class="card p-6 border-l-4 border-l-blue-600 bg-blue-50/20">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span class="text-xs font-bold text-blue-700 uppercase tracking-wider block">Active Mentorship Inquiry</span>
          <h3 class="text-base font-bold text-slate-900 mt-0.5">{{ activeRequest.subject }}</h3>
        </div>
        <StatusBadge :status="activeRequest.status" />
      </div>

      <!-- 3-Stage Progress Tracker -->
      <div class="grid grid-cols-3 gap-2 py-4 my-2 border-y border-slate-200">
        <div class="text-center">
          <div class="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-1">
            ✓
          </div>
          <span class="text-xs font-bold text-slate-800 block">Submitted</span>
          <span class="text-[10px] text-slate-400">{{ formatDate(activeRequest.submittedAt) }}</span>
        </div>

        <div class="text-center">
          <div 
            :class="[
              'w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1',
              activeRequest.status === 'Reviewed' || activeRequest.status === 'Actioned' || activeRequest.status === 'Closed'
                ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            ]"
          >
            {{ activeRequest.status === 'Reviewed' || activeRequest.status === 'Actioned' ? '✓' : '2' }}
          </div>
          <span class="text-xs font-bold text-slate-800 block">Under Review</span>
          <span class="text-[10px] text-slate-400">By Academic Cell</span>
        </div>

        <div class="text-center">
          <div 
            :class="[
              'w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1',
              activeRequest.status === 'Actioned' || activeRequest.status === 'Closed'
                ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            ]"
          >
            {{ activeRequest.status === 'Actioned' ? '✓' : '3' }}
          </div>
          <span class="text-xs font-bold text-slate-800 block">Assigned / Responded</span>
          <span class="text-[10px] text-slate-400">TA Linked</span>
        </div>
      </div>

      <!-- Admin Response Panel if available -->
      <div v-if="activeRequest.adminResponse" class="p-3.5 bg-white rounded-xl border border-slate-200 mt-3 text-xs">
        <div class="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-navy-800">
          <MessageCircle class="w-4 h-4 text-navy-700" />
          Official Academic Cell Response:
        </div>
        <p class="text-slate-700 leading-relaxed">{{ activeRequest.adminResponse }}</p>
      </div>
    </div>

    <!-- Mentorship Submission Form -->
    <div class="card p-6">
      <h3 class="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
        Submit a New Mentorship Request
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Subject -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Subject Category *
          </label>
          <select 
            v-model="form.subject" 
            required
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          >
            <option value="Academic Difficulty">Academic Difficulty (Concept gaps, homework struggles)</option>
            <option value="OPPE Help">OPPE Exam Preparation & Mock Drills</option>
            <option value="Course Planning">Course Planning & Milestone Roadmapping</option>
            <option value="Personal Circumstances">Personal Circumstances / Leave / Medical</option>
            <option value="Other">Other Academic Queries</option>
          </select>
        </div>

        <!-- Multi-course selection -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Attach Relevant Course(s)
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label 
              v-for="c in studentCourses" 
              :key="c.code"
              class="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <input 
                type="checkbox" 
                :value="c.code" 
                v-model="form.selectedCourses" 
                class="rounded text-navy-800 focus:ring-navy-600"
              />
              <span class="font-medium text-slate-800">{{ c.code }} • {{ c.name }}</span>
            </label>
          </div>
        </div>

        <!-- Urgency Level -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Urgency Level
          </label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input 
                type="radio" 
                name="urgency" 
                value="Normal" 
                v-model="form.urgency"
                class="text-navy-800 focus:ring-navy-600"
              />
              <span>Normal (Response within 48-72 hours)</span>
            </label>
            <label class="flex items-center gap-2 text-xs font-medium text-rose-700 cursor-pointer">
              <input 
                type="radio" 
                name="urgency" 
                value="Urgent" 
                v-model="form.urgency"
                class="text-rose-600 focus:ring-rose-500"
              />
              <span class="font-bold">Urgent (Upcoming deadline or exam in &lt; 5 days)</span>
            </label>
          </div>
        </div>

        <!-- Description with 500-char counter -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Description & Detailed Query *
            </label>
            <span 
              :class="[
                'text-[11px] font-medium',
                charsRemaining < 50 ? 'text-rose-600' : 'text-slate-400'
              ]"
            >
              {{ charsRemaining }} characters left
            </span>
          </div>
          <textarea 
            v-model="form.description" 
            maxlength="500"
            rows="4" 
            required
            placeholder="Clearly describe what you need assistance with (e.g. debugging help in Python GRPA, clarification on conditional distributions, or advice on course pacing)..."
            class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          ></textarea>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!form.description.trim()"
          >
            <Send class="w-4 h-4 mr-1.5" />
            Submit Mentorship Request
          </button>
        </div>
      </form>
    </div>

    <!-- Past Requests History Table -->
    <div class="card p-6">
      <h3 class="text-base font-bold text-slate-900 mb-3">Request History & Advisor Feedback</h3>
      
      <div v-if="allRequests.length > 0" class="divide-y divide-slate-100">
        <div 
          v-for="req in allRequests" 
          :key="req.id"
          class="py-4 first:pt-0 last:pb-0 space-y-2 text-xs"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900 text-sm">{{ req.subject }}</span>
              <span 
                v-if="req.urgency === 'Urgent'" 
                class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded"
              >
                Urgent
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-slate-400">{{ formatDate(req.submittedAt) }}</span>
              <StatusBadge :status="req.status" />
            </div>
          </div>

          <p class="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {{ req.description }}
          </p>

          <div v-if="req.adminResponse" class="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
            <strong>Advisor Response:</strong> {{ req.adminResponse }}
          </div>
        </div>
      </div>
      <div v-else class="text-center py-6 text-slate-400 text-xs">
        No past requests found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStudentStore } from '../../stores/studentStore'
import StatusBadge from '../../components/common/StatusBadge.vue'
import { formatDate } from '../../utils/formatters'
import { Send, MessageCircle } from 'lucide-vue-next'

const studentStore = useStudentStore()
const consultationFrequency = computed(() => studentStore.assignedTa?.schedulePreferences?.frequency || 'Weekly')

const form = ref({
  subject: 'Academic Difficulty',
  selectedCourses: ['CS1002'],
  urgency: 'Normal',
  description: ''
})

const studentCourses = [
  { code: 'CS1002', name: 'Programming in Python' },
  { code: 'MA1004', name: 'Statistics for Data Science II' },
  { code: 'MA1003', name: 'Mathematics for Data Science II' },
  { code: 'CS1001', name: 'Computational Thinking' }
]

const charsRemaining = computed(() => 500 - (form.value.description.length || 0))

const allRequests = computed(() => studentStore.mentorshipRequests)

const activeRequest = computed(() => {
  return allRequests.value.find(r => r.status === 'Pending' || r.status === 'Reviewed') || null
})

function handleSubmit() {
  studentStore.submitMentorshipRequest({
    subject: form.value.subject,
    description: form.value.description,
    urgency: form.value.urgency,
    courses: form.value.selectedCourses
  })
  form.value.description = ''
}
</script>
