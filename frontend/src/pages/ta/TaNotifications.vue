<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Teaching Assistant Notification Center</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Alerts for newly assigned students, risk standing updates, overdue intervention follow-ups, and routed mentorship requests.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button" 
          class="btn btn-secondary text-xs"
          @click="notifStore.markAllAsRead"
        >
          <CheckCheck class="w-4 h-4 mr-1.5" />
          Mark All as Read
        </button>
      </div>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
      <button
        v-for="cat in ['ALL', 'Academic', 'Intervention', 'System']"
        :key="cat"
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0',
          activeCategory === cat ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
        ]"
        @click="activeCategory = cat"
      >
        {{ cat === 'ALL' ? 'All Alerts' : cat }}
      </button>
    </div>

    <!-- Notifications List -->
    <div v-if="filteredNotifications.length > 0" class="space-y-3">
      <div 
        v-for="item in filteredNotifications" 
        :key="item.id"
        :class="[
          'p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4',
          item.read ? 'bg-white border-slate-200' : 'bg-amber-50/30 border-amber-200 shadow-xs'
        ]"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-navy-100 text-navy-800 shrink-0 mt-0.5">
            <Bell class="w-4 h-4" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span v-if="!item.read" class="w-2 h-2 rounded-full bg-amber-600"></span>
              <h4 class="text-sm font-bold text-slate-900">{{ item.title }}</h4>
              <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {{ item.category }}
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ item.description }}</p>
            <span class="text-[11px] text-slate-400 block pt-1">{{ formatDateTime(item.timestamp) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 shrink-0 sm:self-center">
          <button 
            v-if="item.actionType === 'UPDATE_OUTCOME'" 
            type="button" 
            class="btn btn-warning text-xs py-1.5 px-3 font-semibold"
            @click="openOutcomeModal(item)"
          >
            Update Outcome
          </button>

          <router-link 
            v-else-if="item.studentId" 
            :to="`/ta/students/${item.studentId}`" 
            class="btn btn-primary text-xs py-1.5 px-3"
            @click="notifStore.markAsRead(item.id)"
          >
            View Student
          </router-link>

          <button 
            v-if="!item.read"
            type="button" 
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Mark as read"
            @click="notifStore.markAsRead(item.id)"
          >
            <Check class="w-4 h-4" />
          </button>

          <!-- Dismiss / Delete Button -->
          <button
            type="button"
            class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Dismiss notification"
            @click="notifStore.deleteNotification(item.id)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="card p-12 text-center text-slate-400">
      <BellOff class="w-12 h-12 mx-auto text-slate-300 mb-2" />
      <p class="text-sm font-semibold text-slate-700">No Notifications</p>
      <p class="text-xs text-slate-400">All alerts and follow-ups are up to date.</p>
    </div>

    <!-- Update Outcome Modal -->
    <Modal
      :is-open="showOutcomeModal"
      title="Update Intervention Outcome"
      subtitle="Record the outcome of your prior student counseling or tutorial session"
      @close="showOutcomeModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Updated Outcome Status *
          </label>
          <select 
            v-model="outcomeForm.outcome" 
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="Positive Response">Positive Response (Student engaged, homework submitted)</option>
            <option value="In Progress">In Progress (Further session scheduled)</option>
            <option value="No Response">No Response (Student unresponsive)</option>
            <option value="Escalated">Escalated to Academic Committee</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Follow-Up Notes & Outcomes
          </label>
          <textarea 
            v-model="outcomeForm.notes" 
            rows="4"
            class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:outline-none"
            placeholder="Document progress observed, test results, or next planned touchpoint..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showOutcomeModal = false">Cancel</button>
        <button type="button" class="btn btn-primary" @click="saveOutcome">Save Outcome</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotificationStore } from '../../stores/notificationStore'
import { useInterventionStore } from '../../stores/interventionStore'
import Modal from '../../components/common/Modal.vue'
import { formatDateTime } from '../../utils/formatters'
import { Bell, CheckCheck, Check, X, BellOff } from 'lucide-vue-next'

const notifStore = useNotificationStore()
const interventionStore = useInterventionStore()

const activeCategory = ref('ALL')
const showOutcomeModal = ref(false)
const selectedInterventionId = ref(null)

const outcomeForm = ref({
  outcome: 'Positive Response',
  notes: ''
})

const filteredNotifications = computed(() => {
  let list = notifStore.currentNotifications
  if (activeCategory.value !== 'ALL') {
    list = list.filter(n => n.category.toLowerCase() === activeCategory.value.toLowerCase())
  }
  return list
})

function openOutcomeModal(notif) {
  selectedInterventionId.value = notif.interventionId || 'int-1'
  showOutcomeModal.value = true
  notifStore.markAsRead(notif.id)
}

function saveOutcome() {
  if (selectedInterventionId.value) {
    interventionStore.updateOutcome(
      selectedInterventionId.value,
      outcomeForm.value.outcome,
      outcomeForm.value.notes
    )
  }
  showOutcomeModal.value = false
  outcomeForm.value = { outcome: 'Positive Response', notes: '' }
}
</script>
