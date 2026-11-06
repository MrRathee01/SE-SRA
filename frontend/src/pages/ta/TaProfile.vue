<template>
  <div class="space-y-6">
    <div class="card p-5">
      <h2 class="text-xl font-bold text-slate-900">Teaching Assistant Profile & Settings</h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Staff credentials, assigned student load overview, and intervention alert configurations.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- TA Personal Info -->
      <div class="card p-6 space-y-4">
        <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
          <InitialsAvatar :name="taProfile?.name" role="ta" size="xl" />
          <div>
            <h3 class="font-bold text-slate-900 text-base">{{ taProfile?.name }}</h3>
            <p class="text-xs text-slate-500">{{ taProfile?.role }}</p>
            <p class="text-xs text-navy-700 font-semibold mt-0.5">{{ taProfile?.department }}</p>
          </div>
        </div>

        <div class="space-y-2.5 text-xs text-slate-700">
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Email</span>
            <span class="font-medium">{{ taProfile?.email }}</span>
          </div>
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Phone</span>
            <span class="font-medium">{{ taProfile?.phone }}</span>
          </div>
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Subject Expertise</span>
            <div class="flex flex-wrap gap-1 mt-1">
              <span 
                v-for="e in taProfile?.expertise || []" 
                :key="e"
                class="bg-navy-50 text-navy-800 px-2 py-0.5 rounded text-[10px] font-semibold"
              >
                {{ e }}
              </span>
            </div>
          </div>
          <div>
            <span class="text-slate-400 block uppercase font-semibold text-[10px]">Current Capacity</span>
            <span class="font-bold text-slate-900">{{ taStore.stats.totalAssigned }} / {{ taProfile?.maxCapacity || 25 }} Students</span>
          </div>
        </div>
      </div>

      <!-- Quick View of Assigned Students -->
      <div class="card p-6 lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 class="text-base font-bold text-slate-900">Assigned Students Roster</h3>
          <router-link to="/ta/dashboard" class="text-xs font-semibold text-navy-700 hover:text-navy-900">
            Open Full Workspace →
          </router-link>
        </div>

        <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          <div 
            v-for="st in taStore.assignedStudents" 
            :key="st.id"
            class="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <InitialsAvatar :name="st.name" role="student" size="sm" />
              <div>
                <span class="font-bold text-xs text-slate-900 block">{{ st.name }}</span>
                <span class="text-[11px] text-slate-400">{{ st.rollNumber }} • Term {{ st.termNumber }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <RiskBadge :level="st.riskLevel" />
              <router-link :to="`/ta/students/${st.id}`" class="btn btn-secondary text-[11px] py-1 px-2.5">
                Profile
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="card p-5 sm:p-6">
      <div class="mb-4">
        <h3 class="font-bold text-slate-900">Consultation availability</h3>
        <p class="mt-1 text-xs text-slate-500">Set recurring hours for office hours, doubt clinics, and one-to-one sessions. You can revise these throughout the term.</p>
      </div>

      <form class="grid grid-cols-1 gap-5 lg:grid-cols-3" @submit.prevent="saveSchedule">
        <div>
          <label for="schedule-frequency" class="mb-1.5 block text-xs font-semibold text-slate-700">Update frequency</label>
          <select id="schedule-frequency" v-model="scheduleForm.frequency" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        <fieldset>
          <legend class="mb-1.5 text-xs font-semibold text-slate-700">Available days</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="day in weekdays" :key="day" class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700">
              <input v-model="scheduleForm.days" type="checkbox" :value="day" class="rounded text-navy-700 focus:ring-navy-600">
              {{ day }}
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend class="mb-1.5 text-xs font-semibold text-slate-700">Time windows</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="slot in timeSlots" :key="slot" class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700">
              <input v-model="scheduleForm.slots" type="checkbox" :value="slot" class="rounded text-navy-700 focus:ring-navy-600">
              {{ slot }}
            </label>
          </div>
        </fieldset>

        <div class="flex items-center justify-between gap-3 lg:col-span-3">
          <p v-if="taProfile?.schedulePreferences?.lastUpdated" class="text-[11px] text-slate-400">
            Last updated {{ formatDate(taProfile.schedulePreferences.lastUpdated) }}
          </p>
          <span v-else></span>
          <button type="submit" class="btn btn-primary text-xs">Save availability</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { useTaStore } from '../../stores/taStore'
import { mockDataService } from '../../services/mock/mockDataService'
import { useToastStore } from '../../stores/toastStore'
import RiskBadge from '../../components/common/RiskBadge.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import { formatDate } from '../../utils/formatters'

const taStore = useTaStore()
const toast = useToastStore()
const taProfile = computed(() => taStore.taProfile)
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const timeSlots = ['Morning (9-12 PM)', 'Afternoon (12-3 PM)', 'Evening (3-6 PM)', 'Late Evening (6-8 PM)']
const scheduleForm = reactive({ frequency: 'Weekly', days: [], slots: [] })

watch(taProfile, profile => {
  const saved = profile?.schedulePreferences || {}
  scheduleForm.frequency = saved.frequency || 'Weekly'
  scheduleForm.days = [...(saved.days || [])]
  scheduleForm.slots = [...(saved.slots || [])]
}, { immediate: true })

function saveSchedule() {
  const success = mockDataService.updateTaSchedule(taStore.currentTaId, {
    frequency: scheduleForm.frequency,
    days: [...scheduleForm.days],
    slots: [...scheduleForm.slots]
  })
  if (!success) {
    toast.error('Availability could not be saved. Please try again.')
    return
  }
  toast.success('Consultation availability updated.')
}
</script>
