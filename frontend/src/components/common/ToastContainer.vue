<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm backdrop-blur-md',
            toastClasses(toast.type)
          ]"
        >
          <!-- Icon -->
          <div class="shrink-0 mt-0.5">
            <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-600" />
            <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5 text-amber-600" />
            <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-rose-600" />
            <Info v-else class="w-5 h-5 text-blue-600" />
          </div>

          <!-- Message -->
          <div class="flex-1 font-medium text-slate-800 leading-snug">
            {{ toast.message }}
          </div>

          <!-- Close -->
          <button 
            type="button" 
            class="text-slate-400 hover:text-slate-600 shrink-0"
            @click="toastStore.remove(toast.id)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '../../stores/toastStore'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()

function toastClasses(type) {
  switch (type) {
    case 'success':
      return 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
    case 'warning':
      return 'bg-amber-50/95 border-amber-200 text-amber-900'
    case 'error':
      return 'bg-rose-50/95 border-rose-200 text-rose-900'
    default:
      return 'bg-blue-50/95 border-blue-200 text-blue-900'
  }
}
</script>

