<template>
  <aside 
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static flex flex-col',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Top Branding in Sidebar -->
    <div class="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
      <router-link to="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-lg bg-navy-600 group-hover:bg-blue-600 text-white flex items-center justify-center font-bold text-sm transition-colors">
          IITM
        </div>
        <div>
          <span class="font-bold text-white group-hover:text-blue-300 tracking-wide text-sm transition-colors">BS Risk Monitor</span>
          <span class="block text-[10px] text-slate-400 uppercase tracking-wider">Intervention Hub</span>
        </div>
      </router-link>
      <button 
        type="button" 
        class="lg:hidden text-slate-400 hover:text-white"
        @click="$emit('close')"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Active Role Pill Banner -->
    <div class="px-6 py-3 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
      <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Portal</span>
      <span 
        class="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
        :class="roleBadgeClasses"
      >
        {{ authStore.currentRole }} View
      </span>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navLinks"
        :key="item.name"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group',
          $route.path === item.to || ($route.path.startsWith(item.to) && item.to !== '/ta/dashboard' && item.to !== '/admin/dashboard' && item.to !== '/student/dashboard')
            ? 'bg-navy-800 text-white shadow-xs font-semibold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        ]"
        @click="$emit('close')"
      >
        <component :is="item.icon" class="w-4 h-4 shrink-0 transition-colors" />
        <span class="flex-1 truncate">{{ item.name }}</span>
        <span 
          v-if="item.badge" 
          class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white"
        >
          {{ item.badge }}
        </span>
      </router-link>

      <!-- Return to Home Page Link -->
      <div class="pt-2 mt-2 border-t border-slate-800/80">
        <router-link
          to="/"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-blue-300 hover:bg-slate-800/60 transition-all group"
          @click="$emit('close')"
        >
          <Home class="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-400 transition-colors" />
          <span class="flex-1 truncate">Platform Home</span>
          <span class="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">/</span>
        </router-link>
      </div>
    </nav>

    <!-- Bottom Status / Milestone Mini Strip -->
    <div class="p-4 border-t border-slate-800 bg-slate-950/30">
      <div class="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
        <div class="flex items-center justify-between text-xs text-slate-300">
          <span class="font-medium">Term 2026-T1</span>
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">Foundation Pacing Rules: 4-in-4, 6-in-6, 8-in-9 active.</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  Bell,
  HelpCircle,
  User,
  Users,
  ClipboardList,
  AlertOctagon,
  Inbox,
  Send,
  Settings,
  Home,
  X
} from 'lucide-vue-next'

defineProps({
  isOpen: { type: Boolean, default: false }
})

defineEmits(['close'])

const authStore = useAuthStore()
const notifStore = useNotificationStore()

const roleBadgeClasses = computed(() => {
  if (authStore.isStudent) return 'bg-emerald-950 text-emerald-400 border border-emerald-800'
  if (authStore.isTa) return 'bg-amber-950 text-amber-400 border border-amber-800'
  return 'bg-blue-950 text-blue-400 border border-blue-800'
})

const navLinks = computed(() => {
  if (authStore.isStudent) {
    return [
      { name: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Course Planner', to: '/student/course-planner', icon: Calendar },
      { name: 'My Progress', to: '/student/progress', icon: GraduationCap },
      { 
        name: 'Notifications', 
        to: '/student/notifications', 
        icon: Bell,
        badge: notifStore.unreadCount > 0 ? notifStore.unreadCount : null
      },
      { name: 'Mentorship Request', to: '/student/mentorship', icon: HelpCircle },
      { name: 'Profile & Settings', to: '/student/profile', icon: User }
    ]
  } else if (authStore.isTa) {
    return [
      { name: 'TA Dashboard', to: '/ta/dashboard', icon: LayoutDashboard },
      { name: 'Student Profile (View)', to: '/ta/students/student-demo', icon: User },
      { 
        name: 'TA Notifications', 
        to: '/ta/notifications', 
        icon: Bell,
        badge: notifStore.unreadCount > 0 ? notifStore.unreadCount : null
      },
      { name: 'Profile & Settings', to: '/ta/profile', icon: Settings }
    ]
  } else {
    // Admin
    return [
      { name: 'Student Risk Overview', to: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Student Details', to: '/admin/students', icon: Users },
      { name: 'TA Overview', to: '/admin/tas', icon: User },
      { name: 'Intervention Tracking', to: '/admin/interventions', icon: ClipboardList },
      { name: 'Repeat Course Tracker', to: '/admin/repeat-tracker', icon: AlertOctagon },
      { name: 'Mentorship Inbox', to: '/admin/mentorship', icon: Inbox },
      { name: 'Notification Center', to: '/admin/notifications', icon: Send },
      { name: 'System Settings', to: '/admin/settings', icon: Settings }
    ]
  }
})
</script>

