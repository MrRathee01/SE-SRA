<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        @click="closeOnBackdrop && $emit('close')"
      ></div>

      <!-- Modal Card -->
      <div 
        :class="[
          'relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full overflow-hidden transform transition-all z-10',
          maxWidthClass
        ]"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-slate-900">{{ title }}</h3>
            <p v-if="subtitle" class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ subtitle }}</p>
          </div>
          <button 
            type="button" 
            class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600"
            @click="$emit('close')"
          >
            <span class="sr-only">Close</span>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 max-h-[75vh] overflow-y-auto">
          <slot></slot>
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  maxWidth: { type: String, default: 'max-w-xl' },
  closeOnBackdrop: { type: Boolean, default: true }
})

defineEmits(['close'])

const maxWidthClass = computed(() => props.maxWidth)
</script>

