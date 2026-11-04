<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5">
      <h2 class="text-xl font-bold text-slate-900">Academic Mentorship & Counseling Inbox</h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Formal inquiries from students requesting subject tutoring, OPPE assistance, and milestone planning support.
      </p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
      <button
        v-for="st in ['ALL', 'Pending', 'Reviewed', 'Actioned', 'Closed']"
        :key="st"
        type="button"
        :class="[
          'px-4 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0',
          adminStore.mentorshipFilterStatus === st ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
        ]"
        @click="adminStore.mentorshipFilterStatus = st"
      >
        {{ st === 'ALL' ? 'All Inquiries' : st }}
      </button>
    </div>

    <!-- 2-Column: Left (Request List), Right (Detail & Response Panel) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Requests List (5 cols) -->
      <div class="lg:col-span-5 space-y-3">
        <div 
          v-for="req in adminStore.filteredMentorshipRequests" 
          :key="req.id"
          :class="[
            'p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2',
            selectedRequest?.id === req.id 
              ? 'border-navy-600 bg-navy-50/40 ring-2 ring-navy-700 shadow-sm' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          ]"
          @click="selectRequest(req)"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span v-if="req.isUnreadByAdmin" class="w-2 h-2 rounded-full bg-rose-600" title="Unread"></span>
                <span class="font-bold text-sm text-slate-900">{{ req.studentName }}</span>
              </div>
              <span class="text-xs text-slate-500">{{ req.rollNumber }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span 
                v-if="req.urgency === 'Urgent'" 
                class="bg-rose-100 text-rose-700 font-bold text-[10px] px-2 py-0.5 rounded"
              >
                Urgent
              </span>
              <StatusBadge :status="req.status" />
            </div>
          </div>

          <div class="font-semibold text-xs text-navy-800 truncate">{{ req.subject }}</div>
          <p class="text-xs text-slate-600 line-clamp-2">{{ req.description }}</p>
          <span class="text-[10px] text-slate-400 block pt-1">{{ formatDate(req.submittedAt) }}</span>
        </div>

        <div v-if="adminStore.filteredMentorshipRequests.length === 0" class="card p-8 text-center text-slate-400 text-xs">
          No mentorship inquiries matching the selected filter.
        </div>
      </div>

      <!-- Detail & Response View (7 cols) -->
      <div class="lg:col-span-7">
        <div v-if="selectedRequest" class="card p-6 space-y-5">
          <!-- Student Academic Context Strip -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <img 
                :src="studentContext?.avatar" 
                class="w-12 h-12 rounded-xl object-cover border border-slate-200" 
                alt=""
              />
              <div>
                <h4 class="font-bold text-slate-900 text-base">{{ selectedRequest.studentName }}</h4>
                <p class="text-xs text-slate-500">
                  {{ selectedRequest.rollNumber }} • Term {{ studentContext?.termNumber || 5 }} • {{ studentContext?.currentLevel || 'FOUNDATION' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <RiskBadge :level="studentContext?.riskLevel || 'At Risk'" />
              <router-link 
                :to="`/admin/students/${selectedRequest.studentId}`" 
                class="btn btn-secondary text-xs py-1 px-2.5"
              >
                Profile →
              </router-link>
            </div>
          </div>

          <!-- Inquiry Details -->
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-slate-900">{{ selectedRequest.subject }}</span>
              <span class="text-slate-400">Received {{ formatDateTime(selectedRequest.submittedAt) }}</span>
            </div>

            <div v-if="selectedRequest.courses?.length > 0" class="text-slate-500">
              <strong>Referenced Courses:</strong> {{ selectedRequest.courses.join(', ') }}
            </div>

            <div class="p-3.5 bg-white rounded-xl border border-slate-200 text-slate-800 leading-relaxed text-xs">
              {{ selectedRequest.description }}
            </div>
          </div>

          <!-- Existing Response if any -->
          <div v-if="selectedRequest.adminResponse" class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <div class="font-bold flex items-center gap-1.5 text-emerald-900">
              ✓ Response Previously Dispatched:
            </div>
            <p>{{ selectedRequest.adminResponse }}</p>
          </div>

          <!-- Admin Response Form -->
          <div class="space-y-4 pt-3 border-t border-slate-200">
            <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Compose Academic Cell Response / Routing
            </h4>

            <!-- Quick Response Template Chips -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[11px] text-slate-400 font-medium">Quick Templates:</span>
              <button 
                type="button" 
                class="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors"
                @click="applyTemplate('oppe')"
              >
                OPPE Practice Session
              </button>
              <button 
                type="button" 
                class="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors"
                @click="applyTemplate('planning')"
              >
                Term Course Planning
              </button>
              <button 
                type="button" 
                class="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors"
                @click="applyTemplate('counseling')"
              >
                Advisor Counseling
              </button>
            </div>

            <textarea 
              v-model="replyText" 
              rows="4" 
              class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
              placeholder="Type official guidance or resolution note to the student..."
            ></textarea>

            <!-- Route to TA and Status Updater -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Route to Specific TA (Optional)</label>
                <select 
                  v-model="routeToTaId" 
                  class="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
                >
                  <option value="">No TA routing (Handle centrally)</option>
                  <option v-for="ta in adminStore.allTas" :key="ta.id" :value="ta.id">
                    {{ ta.name }} ({{ ta.department }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Update Status</label>
                <select 
                  v-model="statusUpdate" 
                  class="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
                >
                  <option value="Actioned">Actioned (Resolved & Closed)</option>
                  <option value="Reviewed">Reviewed (In Progress)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button 
                type="button" 
                class="btn btn-primary"
                @click="dispatchResponse"
              >
                <Send class="w-4 h-4 mr-1.5" />
                Dispatch Response & Notify Student
              </button>
            </div>
          </div>
        </div>

        <div v-else class="card p-12 text-center text-slate-400 text-xs">
          Select an inquiry from the inbox on the left to review details and formulate response.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../stores/adminStore'
import { useToastStore } from '../../stores/toastStore'
import { mockDataService } from '../../services/mock/mockDataService'
import RiskBadge from '../../components/common/RiskBadge.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import { formatDate, formatDateTime } from '../../utils/formatters'
import { Send } from 'lucide-vue-next'

const adminStore = useAdminStore()
const toast = useToastStore()

const selectedRequest = ref(adminStore.filteredMentorshipRequests[0] || null)
const replyText = ref('')
const routeToTaId = ref('')
const statusUpdate = ref('Actioned')

const studentContext = computed(() => {
  if (!selectedRequest.value) return null
  return mockDataService.getStudentById(selectedRequest.value.studentId)
})

function selectRequest(req) {
  selectedRequest.value = req
  req.isUnreadByAdmin = false
  replyText.value = req.adminResponse || ''
}

function applyTemplate(type) {
  if (type === 'oppe') {
    replyText.value = 'We have reviewed your request. TA Dr. Priya Ramachandran has scheduled a 1-on-1 mock OPPE coding test for you this Thursday at 3 PM to practice live problem solving.'
    routeToTaId.value = 'ta-1'
  } else if (type === 'planning') {
    replyText.value = 'Based on your milestone progress, you should register for MA1003 in Term 6 to avoid blocking Term 7 Diploma courses. Please verify in your Course Planner.'
  } else {
    replyText.value = 'An academic counseling appointment has been scheduled for you with the Program Advisor this Friday at 11 AM.'
  }
}

function dispatchResponse() {
  if (!selectedRequest.value) return
  mockDataService.respondToMentorshipRequest(
    selectedRequest.value.id,
    replyText.value || 'Your request has been reviewed and resolved by the Academic Coordination Cell.',
    statusUpdate.value,
    routeToTaId.value || null
  )
  toast.success('Mentorship response dispatched and logged.')
}
</script>

