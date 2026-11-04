import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storageService, StorageKeys } from '../services/mock/storageService'
import { mockDataService } from '../services/mock/mockDataService'

export const DEMO_ACCOUNTS = {
  student: {
    email: 'student@demo.com',
    role: 'student',
    id: 'student-demo',
    name: 'Aditya Verma',
    rollNumber: '21F1000542',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    title: 'Student (Foundation Level)'
  },
  ta: {
    email: 'ta@demo.com',
    role: 'ta',
    id: 'ta-1',
    name: 'Dr. Priya Ramachandran',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Teaching Assistant'
  },
  admin: {
    email: 'admin@demo.com',
    role: 'admin',
    id: 'admin-1',
    name: 'Prof. Rajesh K.',
    department: 'BS Degree Academic Coordination Cell',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: 'Program Academic Administrator'
  }
}

export const useAuthStore = defineStore('auth', () => {
  const currentRole = ref(storageService.getItem(StorageKeys.CURRENT_USER)?.role || 'student')
  const currentUser = ref(storageService.getItem(StorageKeys.CURRENT_USER) || DEMO_ACCOUNTS.student)

  const isAuthenticated = computed(() => !!currentUser.value)
  const isStudent = computed(() => currentRole.value === 'student')
  const isTa = computed(() => currentRole.value === 'ta')
  const isAdmin = computed(() => currentRole.value === 'admin')

  function switchRole(role) {
    if (!DEMO_ACCOUNTS[role]) return
    currentRole.value = role
    currentUser.value = { ...DEMO_ACCOUNTS[role] }
    storageService.setItem(StorageKeys.CURRENT_USER, currentUser.value)
  }

  function login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (cleanEmail === 'student@demo.com') {
      switchRole('student')
      return { success: true, role: 'student', redirect: '/student/dashboard' }
    } else if (cleanEmail === 'ta@demo.com') {
      switchRole('ta')
      return { success: true, role: 'ta', redirect: '/ta/dashboard' }
    } else if (cleanEmail === 'admin@demo.com') {
      switchRole('admin')
      return { success: true, role: 'admin', redirect: '/admin/dashboard' }
    }
    // Fallback: If unknown, default to student role
    switchRole('student')
    return { success: true, role: 'student', redirect: '/student/dashboard' }
  }

  function logout() {
    currentUser.value = null
    storageService.removeItem(StorageKeys.CURRENT_USER)
  }

  function resetPlatformData() {
    mockDataService.resetToDefaults()
    switchRole(currentRole.value || 'student')
  }

  return {
    currentRole,
    currentUser,
    isAuthenticated,
    isStudent,
    isTa,
    isAdmin,
    switchRole,
    login,
    logout,
    resetPlatformData
  }
})

