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
          <img 
            :src="taProfile?.avatar" 
            class="w-16 h-16 rounded-2xl object-cover border border-slate-200" 
            alt="TA Avatar"
          />
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
              <img :src="st.avatar" class="w-9 h-9 rounded-full object-cover" alt="" />
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaStore } from '../../stores/taStore'
import RiskBadge from '../../components/common/RiskBadge.vue'

const taStore = useTaStore()
const taProfile = computed(() => taStore.taProfile)
</script>

