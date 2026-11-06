<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        @click="$emit('close')"
      ></div>

      <!-- Slide-over Drawer -->
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          :class="[
            'w-screen relative bg-white shadow-2xl flex flex-col',
            maxWidthClass
          ]"
        >
          <!-- Drawer Header -->
          <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
              <p v-if="subtitle" class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ subtitle }}</p>
            </div>
            <button 
              type="button" 
              class="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600"
              @click="$emit('close')"
            >
              <span class="sr-only">Close panel</span>
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="p-6 overflow-y-auto flex-1">
            <slot></slot>
          </div>

          <!-- Drawer Footer -->
          <div v-if="$slots.footer" class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  maxWidthClass: { type: String, default: 'max-w-md sm:max-w-lg' }
})

defineEmits(['close'])
</script>

