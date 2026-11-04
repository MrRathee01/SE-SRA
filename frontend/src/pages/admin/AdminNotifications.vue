<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5">
      <h2 class="text-xl font-bold text-slate-900">Program Notification & Alert Dispatch Center</h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Compose, schedule, and broadcast targeted academic notices, milestone warnings, and automated intervention nudges.
      </p>
    </div>

    <!-- 2-Column: Compose Form on Left, Live Preview on Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Compose Form (7 cols) -->
      <div class="card p-6 lg:col-span-7 space-y-4">
        <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          Compose Broadcast Notification
        </h3>

        <form @submit.prevent="handleSend" class="space-y-4 text-xs">
          <!-- Target Audience -->
          <div>
            <label class="block font-semibold text-slate-700 uppercase mb-1">Target Audience *</label>
            <select 
              v-model="form.audience"
              required 
              class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
            >
              <option value="All Students">All Students (Active Program Enrollment)</option>
              <option value="At-Risk Students">At-Risk & Critical Students Only (🔴 & 🟡)</option>
              <option value="Intake Cohort Jan 2024">Specific Intake: Jan 2024</option>
              <option value="All TAs">All Faculty Teaching Assistants</option>
            </select>
          </div>

          <!-- Notification Type & Timing -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-700 uppercase mb-1">Notification Type *</label>
              <select 
                v-model="form.type" 
                required
                class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
              >
                <option value="Risk Alert">Risk Alert</option>
                <option value="Milestone Warning">Milestone Warning</option>
                <option value="General Announcement">General Academic Announcement</option>
                <option value="Intervention Follow-up">Intervention Follow-up Nudge</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 uppercase mb-1">Dispatch Timing</label>
              <select 
                v-model="form.timing" 
                class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
              >
                <option value="NOW">Dispatch Immediately</option>
                <option value="SCHEDULE">Schedule for Later</option>
              </select>
            </div>
          </div>

          <!-- Schedule Date Picker if SCHEDULE -->
          <div v-if="form.timing === 'SCHEDULE'">
            <label class="block font-semibold text-slate-700 uppercase mb-1">Scheduled Date & Time</label>
            <input 
              type="datetime-local" 
              v-model="form.scheduledDate"
              required
              class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
            />
          </div>

          <!-- Subject Title -->
          <div>
            <label class="block font-semibold text-slate-700 uppercase mb-1">Title / Subject *</label>
            <input 
              type="text" 
              v-model="form.title" 
              required
              class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
              placeholder="e.g. Critical Milestone Evaluation Notice"
            />
          </div>

          <!-- Message Body with Variable Chips -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-semibold text-slate-700 uppercase">Message Body *</label>
              <div class="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Insert variable:</span>
                <button 
                  type="button" 
                  class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono"
                  @click="insertVar('{{student_name}}')"
                >
                  student_name
                </button>
                <button 
                  type="button" 
                  class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono"
                  @click="insertVar('{{risk_reason}}')"
                >
                  risk_reason
                </button>
              </div>
            </div>

            <textarea 
              v-model="form.message" 
              rows="5"
              required
              class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:outline-none"
              placeholder="Dear {{student_name}}, your recent performance indicates {{risk_reason}}. Please review your course planner."
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              class="btn btn-secondary text-xs"
              @click="loadTemplate"
            >
              Load Default Template
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
            >
              <Send class="w-4 h-4 mr-1.5" />
              {{ form.timing === 'SCHEDULE' ? 'Schedule Notification' : 'Broadcast Immediately' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Live Notification Preview (5 cols) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="card p-6 space-y-4 bg-slate-50 border border-slate-200">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Live Recipient Preview
            </h4>
            <span class="text-[10px] bg-navy-100 text-navy-800 font-bold px-2 py-0.5 rounded">
              Recipient View
            </span>
          </div>

          <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-sm">{{ form.title || 'Notification Title' }}</span>
              <span class="text-[10px] text-slate-400">Just now</span>
            </div>

            <span class="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              {{ form.type }}
            </span>

            <p class="text-slate-700 leading-relaxed pt-1">
              {{ previewResolvedMessage }}
            </p>

            <div class="pt-2 border-t border-slate-100 flex justify-end">
              <span class="text-[11px] font-semibold text-navy-700">Open Dashboard →</span>
            </div>
          </div>

          <div class="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 leading-relaxed">
            Variables such as <code>&#123;&#123;student_name&#125;&#125;</code> and <code>&#123;&#123;risk_reason&#125;&#125;</code> dynamically populate per individual recipient at dispatch.
          </div>
        </div>
      </div>
    </div>

    <!-- Sent Notifications Log Table -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Historical Dispatched Notifications Log</h3>
          <p class="text-xs text-slate-500 mt-0.5">Audit trail of previously broadcasted alerts and simulated open/read rates.</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-header">Audience</th>
              <th class="table-header">Type</th>
              <th class="table-header">Message Snippet</th>
              <th class="table-header">Dispatched At</th>
              <th class="table-header">Read Rate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="item in notifStore.sentNotificationsLog" 
              :key="item.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="table-cell font-bold text-slate-900 text-xs">
                {{ item.audience }}
              </td>
              <td class="table-cell text-xs">
                <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  {{ item.type }}
                </span>
              </td>
              <td class="table-cell text-xs text-slate-600 max-w-sm truncate" :title="item.message">
                {{ item.message }}
              </td>
              <td class="table-cell text-xs text-slate-500">
                {{ formatDate(item.sentAt) }}
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-2 text-xs">
                  <div class="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      class="bg-emerald-600 h-full rounded-full" 
                      :style="{ width: `${item.readRate}%` }"
                    ></div>
                  </div>
                  <span class="font-bold text-slate-800">{{ item.readRate }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotificationStore } from '../../stores/notificationStore'
import { formatDate } from '../../utils/formatters'
import { Send } from 'lucide-vue-next'

const notifStore = useNotificationStore()

const form = ref({
  audience: 'At-Risk Students',
  type: 'Risk Alert',
  timing: 'NOW',
  scheduledDate: '',
  title: 'Urgent: Academic Milestone Alert',
  message: 'Dear {{student_name}},\n\nYou have been flagged regarding: {{risk_reason}}.\n\nPlease check your course planner and attend the upcoming TA tutoring hours.'
})

const previewResolvedMessage = computed(() => {
  return form.value.message
    .replace(/\{\{student_name\}\}/g, 'Aditya Verma')
    .replace(/\{\{risk_reason\}\}/g, 'approaching the 6-in-6 checkpoint deadline')
})

function insertVar(varString) {
  form.value.message += ` ${varString}`
}

function loadTemplate() {
  form.value.title = 'Notice: Milestone Checkpoint Reminder'
  form.value.message = 'Dear {{student_name}},\n\nOur records indicate you are approaching the semester milestone boundary. Please consult your assigned Teaching Assistant to ensure on-track credit progression.'
}

function handleSend() {
  notifStore.sendAdminNotification({
    audience: form.value.audience,
    type: form.value.type,
    title: form.value.title,
    message: form.value.message,
    scheduledFor: form.value.timing === 'SCHEDULE' ? form.value.scheduledDate : null
  })
}
</script>

