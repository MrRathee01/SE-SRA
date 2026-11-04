<template>
  <div class="w-full flex flex-col gap-3 py-2">
    <div 
      v-for="(stage, idx) in stages" 
      :key="stage.name"
      class="group relative"
    >
      <div class="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
        <span class="flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-navy-100 text-navy-800 flex items-center justify-center text-[10px] font-bold">
            {{ idx + 1 }}
          </span>
          <span class="font-semibold text-slate-800">{{ stage.name }}</span>
        </span>
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-900">{{ stage.count }} students</span>
          <span class="text-slate-400">({{ stage.pct }}%)</span>
        </div>
      </div>

      <!-- Funnel Bar -->
      <div class="w-full h-7 bg-slate-100 rounded-lg overflow-hidden relative flex items-center">
        <div 
          :class="['h-full transition-all duration-500 rounded-lg', stage.colorClass]"
          :style="{ width: `${stage.pct}%` }"
        ></div>
        <span v-if="idx > 0" class="absolute right-3 text-[11px] font-medium text-slate-500">
          Drop-off: {{ stage.dropOff }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      flagged: 120,
      assignedTa: 98,
      interventionDone: 82,
      outcomeLogged: 68,
      resolved: 54
    })
  }
})

const stages = computed(() => {
  const f = props.data.flagged || 1
  const a = props.data.assignedTa || 0
  const i = props.data.interventionDone || 0
  const o = props.data.outcomeLogged || 0
  const r = props.data.resolved || 0

  return [
    {
      name: 'Students Flagged',
      count: f,
      pct: 100,
      dropOff: '—',
      colorClass: 'bg-navy-700'
    },
    {
      name: 'Assigned to TA',
      count: a,
      pct: Math.round((a / f) * 100),
      dropOff: `-${f - a} (${Math.round(((f - a) / f) * 100)}%)`,
      colorClass: 'bg-navy-600'
    },
    {
      name: 'Intervention Done',
      count: i,
      pct: Math.round((i / f) * 100),
      dropOff: `-${a - i} (${Math.round(((a - i) / a) * 100)}%)`,
      colorClass: 'bg-blue-600'
    },
    {
      name: 'Outcome Logged',
      count: o,
      pct: Math.round((o / f) * 100),
      dropOff: `-${i - o} (${Math.round(((i - o) / i) * 100)}%)`,
      colorClass: 'bg-amber-500'
    },
    {
      name: 'Resolved / Safe',
      count: r,
      pct: Math.round((r / f) * 100),
      dropOff: `-${o - r} (${Math.round(((o - r) / o) * 100)}%)`,
      colorClass: 'bg-emerald-600'
    }
  ]
})
</script>

