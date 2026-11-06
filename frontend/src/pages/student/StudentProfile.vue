<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5">
      <h2 class="text-xl font-bold text-slate-900">Student Profile & Settings</h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Manage personal contact records, linked teaching assistant information, and alert communication preferences.
      </p>
    </div>

    <!-- 2-Column Grid: Personal Info & Linked TA -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Personal Info (Read-only System Data) -->
      <div class="card p-6 lg:col-span-2 space-y-4">
        <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <User class="w-4 h-4 text-navy-700" />
          Academic & Personal Records (System Verified)
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-slate-400 font-semibold block uppercase">Full Name</span>
            <span class="text-sm font-bold text-slate-800">{{ student.name }}</span>
          </div>

          <div>
            <span class="text-slate-400 font-semibold block uppercase">Roll Number</span>
            <span class="text-sm font-bold text-slate-800">{{ student.rollNumber }}</span>
          </div>

          <div>
            <span class="text-slate-400 font-semibold block uppercase">Official Program Email</span>
            <span class="text-slate-700 font-medium">{{ student.studentEmail }}</span>
          </div>

          <div>
            <span class="text-slate-400 font-semibold block uppercase">Personal Email</span>
            <span class="text-slate-700 font-medium">{{ student.email }}</span>
          </div>

          <div>
            <span class="text-slate-400 font-semibold block uppercase">Registered Program</span>
            <span class="text-slate-700 font-medium">IITM BS Degree in Data Science & Applications</span>
          </div>

          <div>
            <span class="text-slate-400 font-semibold block uppercase">Current Academic Level</span>
            <span class="font-bold text-navy-800">{{ student.currentLevel }} (Term {{ student.termNumber }} of {{ student.totalTerms }})</span>
          </div>

          <div>
            <span class="text-slate-400 font-semibold block uppercase">Mobile Number</span>
            <span class="text-slate-700 font-medium">{{ student.phone }}</span>
          </div>

          <div>
            <span class="text-slate-400 font-semibold block uppercase">Enrollment Status</span>
            <StatusBadge :status="student.status" />
          </div>
        </div>
      </div>

      <!-- Linked TA Card -->
      <div class="card p-6 flex flex-col justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Users class="w-4 h-4 text-navy-700" />
            Assigned Teaching Assistant
          </h3>

          <div v-if="assignedTa" class="mt-4 space-y-3">
            <div class="flex items-center gap-3">
              <InitialsAvatar :name="assignedTa.name" role="ta" size="lg" />
              <div>
                <h4 class="font-bold text-sm text-slate-900">{{ assignedTa.name }}</h4>
                <p class="text-xs text-slate-500">{{ assignedTa.role }}</p>
                <p class="text-xs text-navy-700 font-medium mt-0.5">{{ assignedTa.department }}</p>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div><strong>Email:</strong> {{ assignedTa.email }}</div>
              <div><strong>Phone:</strong> {{ assignedTa.phone }}</div>
              <div><strong>Specialization:</strong> {{ assignedTa.expertise?.join(', ') }}</div>
            </div>
          </div>

          <div v-else class="text-center py-6 text-slate-400 text-xs">
            No Teaching Assistant currently assigned.
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100">
          <router-link to="/student/mentorship" class="btn btn-outline-primary w-full text-xs font-semibold">
            Contact Academic Cell
          </router-link>
        </div>
      </div>
    </div>

    <!-- Notification Preferences -->
    <div class="card p-6">
      <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
        <Bell class="w-4 h-4 text-navy-700" />
        Notification & Alert Preferences
      </h3>
      <p class="text-xs text-slate-500 mt-1 mb-4">
        Customize channels through which you receive automated academic alerts.
      </p>

      <div class="divide-y divide-slate-100 text-xs sm:text-sm">
        <div class="py-3 flex items-center justify-between">
          <div>
            <span class="font-bold text-slate-800 block">Academic Risk Alerts</span>
            <span class="text-xs text-slate-500">Immediate warnings when milestone pacing or scores change status</span>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" v-model="prefs.riskAlertsInApp" class="rounded text-navy-800 focus:ring-navy-600" />
              <span>In-App</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" v-model="prefs.riskAlertsEmail" class="rounded text-navy-800 focus:ring-navy-600" />
              <span>Email</span>
            </label>
          </div>
        </div>

        <div class="py-3 flex items-center justify-between">
          <div>
            <span class="font-bold text-slate-800 block">TA Assignment & Interaction Notes</span>
            <span class="text-xs text-slate-500">Notifications when a new TA is assigned or study plan is logged</span>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" v-model="prefs.taUpdatesInApp" class="rounded text-navy-800 focus:ring-navy-600" />
              <span>In-App</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" v-model="prefs.taUpdatesEmail" class="rounded text-navy-800 focus:ring-navy-600" />
              <span>Email</span>
            </label>
          </div>
        </div>

        <div class="py-3 flex items-center justify-between">
          <div>
            <span class="font-bold text-slate-800 block">Upcoming Deadlines & Quizzes</span>
            <span class="text-xs text-slate-500">Reminders 48 hours prior to assignment cutoff dates</span>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" v-model="prefs.deadlinesInApp" class="rounded text-navy-800 focus:ring-navy-600" />
              <span>In-App</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" v-model="prefs.deadlinesEmail" class="rounded text-navy-800 focus:ring-navy-600" />
              <span>Email</span>
            </label>
          </div>
        </div>

        <div class="py-3 flex items-center justify-between">
          <div>
            <span class="font-bold text-slate-800 block">Mentorship Request Responses</span>
            <span class="text-xs text-slate-500">Updates whenever an advisor reviews or resolves your inquiry</span>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" v-model="prefs.mentorshipInApp" class="rounded text-navy-800 focus:ring-navy-600" />
              <span>In-App</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer text-xs">
              <input type="checkbox" v-model="prefs.mentorshipEmail" class="rounded text-navy-800 focus:ring-navy-600" />
              <span>Email</span>
            </label>
          </div>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 flex justify-end">
        <button type="button" class="btn btn-primary text-xs" @click="savePrefs">
          Save Notification Preferences
        </button>
      </div>
    </div>

    <!-- Password Change Simulation -->
    <div class="card p-6">
      <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
        <KeyRound class="w-4 h-4 text-navy-700" />
        Change Account Password (Demo Simulation)
      </h3>

      <form @submit.prevent="handlePasswordChange" class="mt-4 max-w-xl space-y-4 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Current Password</label>
          <input 
            type="password" 
            v-model="pwdForm.current" 
            required 
            placeholder="••••••••" 
            class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">New Password</label>
            <input 
              type="password" 
              v-model="pwdForm.newPwd" 
              required 
              placeholder="••••••••" 
              class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              v-model="pwdForm.confirm" 
              required 
              placeholder="••••••••" 
              class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
            />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button type="submit" class="btn btn-primary text-xs">
            Update Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStudentStore } from '../../stores/studentStore'
import { useToastStore } from '../../stores/toastStore'
import StatusBadge from '../../components/common/StatusBadge.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import { User, Users, Bell, KeyRound } from 'lucide-vue-next'

const studentStore = useStudentStore()
const toast = useToastStore()

const student = computed(() => studentStore.student)
const assignedTa = computed(() => studentStore.assignedTa)

const prefs = ref({ ...studentStore.notifPreferences })

const pwdForm = ref({
  current: '',
  newPwd: '',
  confirm: ''
})

function savePrefs() {
  studentStore.saveNotificationPreferences(prefs.value)
}

function handlePasswordChange() {
  if (pwdForm.value.newPwd !== pwdForm.value.confirm) {
    toast.error('New password and confirmation do not match.')
    return
  }
  toast.success('Password updated successfully in demo session.')
  pwdForm.value = { current: '', newPwd: '', confirm: '' }
}
</script>

