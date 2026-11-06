<template>
  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', colorClasses]">
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'Active'
  }
})

const colorClasses = computed(() => {
  const s = (props.status || '').toLowerCase()
  if (['pass', 'completed', 'met', 'positive response', 'resolved', 'active', 'cleared'].includes(s)) {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  }
  if (['ongoing', 'in progress', 'reviewed', 'actioned', 'scheduled'].includes(s)) {
    return 'bg-blue-50 text-blue-700 border border-blue-200'
  }
  if (['approaching', 'warning', 'pending', 'retry', 'improvement'].includes(s)) {
    return 'bg-amber-50 text-amber-700 border border-amber-200'
  }
  if (['fail', 'missed', 'critical', 'no response', 'escalated', 'blocked', 'overdue'].includes(s)) {
    return 'bg-rose-50 text-rose-700 border border-rose-200'
  }
  return 'bg-slate-100 text-slate-700 border border-slate-200'
})
</script>

