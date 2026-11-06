<template>
  <div 
    :class="[
      'card p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden',
      clickable ? 'cursor-pointer hover:border-navy-400' : ''
    ]"
    @click="clickable && $emit('click')"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">{{ label }}</p>
        <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{{ value }}</h3>
      </div>
      <div 
        v-if="iconName || $slots.icon" 
        :class="['p-2.5 rounded-lg flex items-center justify-center shrink-0', iconBgClass]"
      >
        <slot name="icon">
          <component :is="iconComponent" class="w-5 h-5" :class="iconColorClass" />
        </slot>
      </div>
    </div>
    
    <div v-if="subtext || badge" class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <span>{{ subtext }}</span>
      <span v-if="badge" :class="['px-2 py-0.5 rounded font-medium', badgeClass]">
        {{ badge }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtext: { type: String, default: '' },
  badge: { type: String, default: '' },
  badgeClass: { type: String, default: 'bg-slate-100 text-slate-700' },
  iconName: { type: String, default: '' },
  iconBgClass: { type: String, default: 'bg-navy-50' },
  iconColorClass: { type: String, default: 'text-navy-700' },
  clickable: { type: Boolean, default: false }
})

defineEmits(['click'])

const iconComponent = computed(() => {
  if (!props.iconName) return null
  return LucideIcons[props.iconName] || null
})
</script>

