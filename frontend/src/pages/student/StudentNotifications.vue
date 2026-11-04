<template>
  <div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Notifications & Alerts Center</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Real-time updates regarding your academic standing, TA communications, and submission alerts.
        </p>
      </div>

      <div class="flex items-center gap-3">
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

    <!-- Category Tabs & Read Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div class="flex items-center gap-1.5 overflow-x-auto">
        <button
          v-for="cat in ['ALL', 'Risk', 'Academic', 'TA', 'System']"
          :key="cat"
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0',
            notifStore.activeCategory === cat 
              ? 'bg-navy-800 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          ]"
          @click="notifStore.activeCategory = cat"
        >
          {{ cat === 'ALL' ? 'All Alerts' : cat }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-xs text-slate-500 font-medium">Filter:</label>
        <select 
          v-model="notifStore.filterReadState"
          class="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white focus:outline-none"
        >
          <option value="ALL">All Items</option>
          <option value="UNREAD">Unread Only</option>
          <option value="READ">Read Only</option>
        </select>
      </div>
    </div>

    <!-- Notifications List -->
    <div v-if="paginatedNotifications.length > 0" class="space-y-3">
      <div
        v-for="notif in paginatedNotifications"
        :key="notif.id"
        :class="[
          'p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4',
          notif.read ? 'bg-white border-slate-200' : 'bg-blue-50/40 border-blue-200 shadow-xs'
        ]"
      >
        <div class="flex items-start gap-3.5">
          <div 
            :class="[
              'p-2.5 rounded-xl shrink-0 mt-0.5',
              getCategoryBadge(notif.category).bg,
              getCategoryBadge(notif.category).text
            ]"
          >
            <component :is="getCategoryBadge(notif.category).icon" class="w-5 h-5" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-navy-700"></span>
              <h4 class="text-sm font-bold text-slate-900">{{ notif.title }}</h4>
              <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {{ notif.category }}
              </span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">{{ notif.description }}</p>
            <span class="text-[11px] text-slate-400 block pt-1">
              {{ formatDateTime(notif.timestamp) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <button
            v-if="notif.actionType === 'RISK_EXPLANATION'"
            type="button"
            class="btn btn-primary text-xs py-1.5 px-3"
            @click="openRiskModal(notif)"
          >
            View Details
          </button>

          <button
            v-else-if="notif.actionRoute"
            type="button"
            class="btn btn-secondary text-xs py-1.5 px-3"
            @click="handleActionNavigate(notif)"
          >
            {{ notif.actionLabel || 'View' }}
          </button>

          <button
            v-if="!notif.read"
            type="button"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            title="Mark as read"
            @click="notifStore.markAsRead(notif.id)"
          >
            <Check class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card p-12 text-center text-slate-400">
      <BellOff class="w-12 h-12 mx-auto text-slate-300 mb-3" />
      <h4 class="text-base font-semibold text-slate-700">No Notifications Found</h4>
      <p class="text-xs text-slate-500 mt-1">There are no alerts matching your selected category filter.</p>
    </div>

    <!-- Load More / Pagination -->
    <div v-if="hasMore" class="text-center pt-2">
      <button 
        type="button" 
        class="btn btn-secondary text-xs font-semibold px-6"
        @click="displayLimit += 5"
      >
        Load More Notifications
      </button>
    </div>

    <!-- Risk Explanation Modal -->
    <RiskExplanationModal
      :is-open="showRiskModal"
      :student="studentStore.student"
      cta-label="Request Mentorship"
      @close="showRiskModal = false"
      @action="$router.push('/student/mentorship')"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '../../stores/notificationStore'
import { useStudentStore } from '../../stores/studentStore'
import RiskExplanationModal from '../../components/modals/RiskExplanationModal.vue'
import { formatDateTime } from '../../utils/formatters'
import {
  Bell,
  CheckCheck,
  Check,
  AlertTriangle,
  BookOpen,
  User,
  Info,
  BellOff
} from 'lucide-vue-next'

const router = useRouter()
const notifStore = useNotificationStore()
const studentStore = useStudentStore()

const displayLimit = ref(6)
const showRiskModal = ref(false)

const paginatedNotifications = computed(() => {
  return notifStore.currentNotifications.slice(0, displayLimit.value)
})

const hasMore = computed(() => {
  return notifStore.currentNotifications.length > displayLimit.value
})

function getCategoryBadge(cat) {
  switch (cat) {
    case 'Risk':
      return { bg: 'bg-rose-100', text: 'text-rose-800', icon: AlertTriangle }
    case 'Academic':
      return { bg: 'bg-blue-100', text: 'text-blue-800', icon: BookOpen }
    case 'TA':
      return { bg: 'bg-amber-100', text: 'text-amber-800', icon: User }
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-800', icon: Info }
  }
}

function openRiskModal(notif) {
  notifStore.markAsRead(notif.id)
  showRiskModal.value = true
}

function handleActionNavigate(notif) {
  notifStore.markAsRead(notif.id)
  router.push(notif.actionRoute)
}
</script>

