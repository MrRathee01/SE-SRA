<template>
  <div 
    :class="[
      'rounded-full font-bold flex items-center justify-center select-none uppercase tracking-wider shrink-0 transition-all',
      sizeClasses,
      colorClasses
    ]"
    :title="name"
  >
    <span>{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'User'
  },
  size: {
    type: String,
    default: 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
  },
  role: {
    type: String,
    default: null // optional 'student' | 'ta' | 'admin' for role-tinted mode
  }
})

// Extract up to 2 initials (e.g. "Aditya Verma" -> "AV", "Rajesh" -> "R")
const initials = computed(() => {
  if (!props.name || typeof props.name !== 'string') return 'U'
  const cleaned = props.name.trim().replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-6 h-6 text-[10px]'
    case 'sm':
      return 'w-7 h-7 text-[11px]'
    case 'lg':
      return 'w-12 h-12 text-base'
    case 'xl':
      return 'w-16 h-16 text-xl'
    case 'md':
    default:
      return 'w-9 h-9 text-sm'
  }
})

// Palette of soothing pastel backgrounds with matching rich text colors
const PALETTES = [
  'bg-blue-100 text-blue-800 border border-blue-200/80',
  'bg-indigo-100 text-indigo-800 border border-indigo-200/80',
  'bg-purple-100 text-purple-800 border border-purple-200/80',
  'bg-teal-100 text-teal-800 border border-teal-200/80',
  'bg-emerald-100 text-emerald-800 border border-emerald-200/80',
  'bg-sky-100 text-sky-800 border border-sky-200/80',
  'bg-amber-100 text-amber-800 border border-amber-200/80',
  'bg-slate-200 text-slate-800 border border-slate-300'
]

const colorClasses = computed(() => {
  if (props.role === 'student') {
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200/90'
  }
  if (props.role === 'ta') {
    return 'bg-blue-100 text-blue-800 border border-blue-200/90'
  }
  if (props.role === 'admin') {
    return 'bg-purple-100 text-purple-800 border border-purple-200/90'
  }

  // Deterministic color from name hash
  let hash = 0
  const str = props.name || 'User'
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % PALETTES.length
  return PALETTES[index]
})
</script>
