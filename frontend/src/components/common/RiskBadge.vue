<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all',
      classes.badge,
      clickable ? 'cursor-pointer hover:shadow-sm' : ''
    ]"
    @click="clickable && $emit('click')"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', classes.dot]"></span>
    <span>{{ label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: String,
    default: 'Safe'
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const label = computed(() => {
  const l = (props.level || '').toLowerCase()
  if (l.includes('crit') || l === 'high') return 'Critical'
  if (l.includes('risk') || l.includes('warn') || l.includes('attention') || l === 'medium') return 'At Risk'
  return 'Safe'
})

const classes = computed(() => {
  const l = label.value
  if (l === 'Critical') {
    return {
      badge: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
      dot: 'bg-rose-600'
    }
  }
  if (l === 'At Risk') {
    return {
      badge: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      dot: 'bg-amber-500'
    }
  }
  return {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    dot: 'bg-emerald-500'
  }
})
</script>

