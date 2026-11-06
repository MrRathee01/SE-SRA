import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockDataService } from '../services/mock/mockDataService'
import { useAuthStore } from './authStore'
import { useToastStore } from './toastStore'

export const useNotificationStore = defineStore('notification', () => {
  const auth = useAuthStore()
  const toast = useToastStore()
  const activeCategory = ref('ALL') // 'ALL' | 'Risk' | 'Academic' | 'TA' | 'System'
  const filterReadState = ref('ALL') // 'ALL' | 'UNREAD' | 'READ'
  const notificationsRevision = ref(0)

  // Admin sent log
  const sentNotificationsLog = ref([
    {
      id: 'sent-1',
      audience: 'Students At Risk (🟡 & 🔴)',
      type: 'Risk Alert',
      message: 'Notice: Academic milestone evaluation complete. Check your updated course planner.',
      sentAt: '2026-10-28T10:00:00Z',
      readRate: 78
    },
    {
      id: 'sent-2',
      audience: 'Intake Cohort Jan 2024',
      type: 'Milestone Warning',
      message: 'Reminder to plan Term 5 registrations before the cutoff date.',
      sentAt: '2026-10-20T14:30:00Z',
      readRate: 92
    },
    {
      id: 'sent-3',
      audience: 'All TAs',
      type: 'Intervention Follow-up',
      message: 'Please review overdue intervention logs and update outcomes before Friday.',
      sentAt: '2026-10-15T09:00:00Z',
      readRate: 100
    }
  ])

  // Current recipient notifications
  const currentNotifications = computed(() => {
    notificationsRevision.value
    let recipientType = 'STUDENT'
    let recipientId = 'student-demo'

    if (auth.isTa) {
      recipientType = 'TA'
      recipientId = 'ta-1'
    } else if (auth.isAdmin) {
      recipientType = 'ADMIN'
      recipientId = 'admin-1'
    }

    let list = mockDataService.getNotifications(recipientType, recipientId)

    if (activeCategory.value !== 'ALL') {
      list = list.filter(n => n.category.toLowerCase() === activeCategory.value.toLowerCase())
    }

    if (filterReadState.value === 'UNREAD') {
      list = list.filter(n => !n.read)
    } else if (filterReadState.value === 'READ') {
      list = list.filter(n => n.read)
    }

    return list
  })

  const unreadCount = computed(() => {
    notificationsRevision.value
    let recipientType = 'STUDENT'
    let recipientId = 'student-demo'
    if (auth.isTa) {
      recipientType = 'TA'
      recipientId = 'ta-1'
    } else if (auth.isAdmin) {
      recipientType = 'ADMIN'
      recipientId = 'admin-1'
    }
    return mockDataService.getNotifications(recipientType, recipientId).filter(n => !n.read).length
  })

  function markAsRead(id) {
    if (mockDataService.markNotificationAsRead(id)) {
      notificationsRevision.value += 1
    }
  }

  function deleteNotification(id) {
    const ok = mockDataService.deleteNotification(id)
    if (ok) {
      notificationsRevision.value += 1
      toast.info('Notification dismissed.')
    }
  }

  function markAllAsRead() {
    let recipientType = 'STUDENT'
    let recipientId = 'student-demo'
    if (auth.isTa) {
      recipientType = 'TA'
      recipientId = 'ta-1'
    } else if (auth.isAdmin) {
      recipientType = 'ADMIN'
      recipientId = 'admin-1'
    }
    mockDataService.markAllNotificationsAsRead(recipientType, recipientId)
    notificationsRevision.value += 1
    toast.success('All notifications marked as read.')
  }

  function sendAdminNotification({ audience, type, title, message, scheduledFor = null }) {
    if (scheduledFor) {
      sentNotificationsLog.value.unshift({
        id: `sent-${Date.now()}`,
        audience,
        type,
        message,
        sentAt: `Scheduled for ${new Date(scheduledFor).toLocaleDateString()}`,
        readRate: 0
      })
      toast.success('Notification scheduled successfully!')
      return
    }

    // Immediate dispatch simulation
    const sentCount = mockDataService.sendBulkNotifications({
      audience: audience === 'At-Risk Students' ? 'AT_RISK' : 'ALL',
      title: title || 'Notice from Program Administration',
      message,
      category: type === 'Risk Alert' ? 'Risk' : (type === 'Milestone Warning' ? 'Academic' : 'System')
    })

    sentNotificationsLog.value.unshift({
      id: `sent-${Date.now()}`,
      audience,
      type,
      message,
      sentAt: new Date().toISOString(),
      readRate: Math.floor(Math.random() * 20) + 75
    })

    toast.success(`Notification sent successfully to ${sentCount} recipient(s)!`)
  }

  return {
    activeCategory,
    filterReadState,
    sentNotificationsLog,
    currentNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendAdminNotification
  }
})
