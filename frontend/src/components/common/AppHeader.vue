<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Left: Mobile Toggle & Brand -->
      <div class="flex items-center gap-3">
        <button 
          type="button" 
          class="lg:hidden text-slate-500 hover:text-slate-700 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-600"
          @click="$emit('toggle-sidebar')"
        >
          <Menu class="w-6 h-6" />
        </button>

        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-lg bg-navy-900 group-hover:bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm transition-colors">
            IITM
          </div>
          <div class="hidden sm:block">
            <h1 class="text-sm font-bold text-slate-900 group-hover:text-blue-700 leading-tight transition-colors">Academic Risk & Intervention Platform</h1>
            <p class="text-[11px] text-slate-500 font-medium">IIT Madras BS Degree Program</p>
          </div>
        </router-link>
      </div>

      <!-- Right: Demo Role Switcher, Notifications, User Menu -->
      <div class="flex items-center gap-2.5 sm:gap-4">
        <!-- Quick Role Switcher Pill -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 hidden md:inline">
            Role:
          </span>
          <button
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
              authStore.isStudent ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
            @click="handleRoleChange('student')"
          >
            Student
          </button>
          <button
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
              authStore.isTa ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
            @click="handleRoleChange('ta')"
          >
            TA
          </button>
          <button
            type="button"
            :class="[
              'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
              authStore.isAdmin ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
            @click="handleRoleChange('admin')"
          >
            Admin
          </button>
        </div>

        <!-- Notifications Bell -->
        <router-link
          :to="notifRoute"
          class="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell class="w-5 h-5" />
          <span 
            v-if="notifStore.unreadCount > 0"
            class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"
          ></span>
        </router-link>

        <!-- User Profile Dropdown -->
        <div class="relative" ref="dropdownRef">
          <button
            type="button"
            class="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
            @click="isDropdownOpen = !isDropdownOpen"
          >
            <InitialsAvatar
              :name="authStore.currentUser?.name"
              :role="authStore.currentRole"
              size="sm"
            />
            <div class="hidden md:block text-left text-xs">
              <div class="font-semibold text-slate-900">{{ authStore.currentUser?.name }}</div>
              <div class="text-slate-500 capitalize">{{ authStore.currentRole }}</div>
            </div>
            <ChevronDown class="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs"
          >
            <div class="px-4 py-2 border-b border-slate-100">
              <div class="font-semibold text-slate-900 text-sm">{{ authStore.currentUser?.name }}</div>
              <div class="text-slate-500">{{ authStore.currentUser?.email }}</div>
              <div class="mt-1 text-[11px] text-navy-700 font-medium capitalize">
                Active Role: {{ authStore.currentRole }}
              </div>
            </div>

            <button
              type="button"
              class="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              @click="handleResetData"
            >
              <RotateCcw class="w-4 h-4 text-slate-500" />
              Reset Demo Data
            </button>

            <button
              type="button"
              class="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 mt-1"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import { useToastStore } from '../../stores/toastStore'
import InitialsAvatar from './InitialsAvatar.vue'
import { Bell, Menu, ChevronDown, RotateCcw, LogOut } from 'lucide-vue-next'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()
const notifStore = useNotificationStore()
const toast = useToastStore()

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const notifRoute = computed(() => {
  if (authStore.isStudent) return '/student/notifications'
  if (authStore.isTa) return '/ta/notifications'
  return '/admin/notifications'
})

function handleRoleChange(role) {
  authStore.switchRole(role)
  toast.info(`Switched view to ${role.toUpperCase()} dashboard.`)
  if (role === 'student') router.push('/student/dashboard')
  else if (role === 'ta') router.push('/ta/dashboard')
  else router.push('/admin/executive-dashboard')
}

function handleResetData() {
  if (confirm('Reset all demo data (students, interventions, mentorship requests, notifications) to default state?')) {
    authStore.resetPlatformData()
    toast.success('Demo data restored to initial state.')
    isDropdownOpen.value = false
    window.location.reload()
  }
}

function handleLogout() {
  authStore.logout()
  isDropdownOpen.value = false
  router.push('/login')
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
