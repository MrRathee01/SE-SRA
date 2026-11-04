import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Layouts
import AppLayout from '../layouts/AppLayout.vue'
import LoginView from '../pages/auth/LoginView.vue'
import HomePage from '../pages/HomePage.vue'

// Student Views
import StudentDashboard from '../pages/student/StudentDashboard.vue'
import CoursePlanner from '../pages/student/CoursePlanner.vue'
import MyProgress from '../pages/student/MyProgress.vue'
import StudentNotifications from '../pages/student/StudentNotifications.vue'
import MentorshipRequest from '../pages/student/MentorshipRequest.vue'
import StudentProfile from '../pages/student/StudentProfile.vue'

// TA Views
import TaDashboard from '../pages/ta/TaDashboard.vue'
import TaStudentProfile from '../pages/ta/TaStudentProfile.vue'
import TaNotifications from '../pages/ta/TaNotifications.vue'
import TaProfile from '../pages/ta/TaProfile.vue'

// Admin Views
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import AdminStudentOverview from '../pages/admin/AdminStudentOverview.vue'
import AdminTaOverview from '../pages/admin/AdminTaOverview.vue'
import AdminStudentProfile from '../pages/admin/AdminStudentProfile.vue'
import AdminInterventions from '../pages/admin/AdminInterventions.vue'
import AdminRepeatTracker from '../pages/admin/AdminRepeatTracker.vue'
import AdminMentorshipInbox from '../pages/admin/AdminMentorshipInbox.vue'
import AdminNotifications from '../pages/admin/AdminNotifications.vue'
import AdminSettings from '../pages/admin/AdminSettings.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: () => {
      const auth = useAuthStore()
      if (!auth.isAuthenticated) return '/login'
      if (auth.isStudent) return '/student/dashboard'
      if (auth.isTa) return '/ta/dashboard'
      return '/admin/dashboard'
    }
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      // Student Routes
      {
        path: 'student/dashboard',
        name: 'StudentDashboard',
        component: StudentDashboard,
        meta: { role: 'student' }
      },
      {
        path: 'student/course-planner',
        name: 'CoursePlanner',
        component: CoursePlanner,
        meta: { role: 'student' }
      },
      {
        path: 'student/progress',
        name: 'MyProgress',
        component: MyProgress,
        meta: { role: 'student' }
      },
      {
        path: 'student/notifications',
        name: 'StudentNotifications',
        component: StudentNotifications,
        meta: { role: 'student' }
      },
      {
        path: 'student/mentorship',
        name: 'MentorshipRequest',
        component: MentorshipRequest,
        meta: { role: 'student' }
      },
      {
        path: 'student/profile',
        name: 'StudentProfile',
        component: StudentProfile,
        meta: { role: 'student' }
      },

      // TA Routes
      {
        path: 'ta/dashboard',
        name: 'TaDashboard',
        component: TaDashboard,
        meta: { role: 'ta' }
      },
      {
        path: 'ta/students/:id',
        name: 'TaStudentProfile',
        component: TaStudentProfile,
        meta: { role: 'ta' }
      },
      {
        path: 'ta/notifications',
        name: 'TaNotifications',
        component: TaNotifications,
        meta: { role: 'ta' }
      },
      {
        path: 'ta/profile',
        name: 'TaProfile',
        component: TaProfile,
        meta: { role: 'ta' }
      },

      // Admin Routes
      {
        path: 'admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { role: 'admin' }
      },
      {
        path: 'admin/students',
        name: 'AdminStudentOverview',
        component: AdminStudentOverview,
        meta: { role: 'admin' }
      },
      {
        path: 'admin/students/:id',
        name: 'AdminStudentProfile',
        component: AdminStudentProfile,
        meta: { role: 'admin' }
      },
      {
        path: 'admin/tas',
        name: 'AdminTaOverview',
        component: AdminTaOverview,
        meta: { role: 'admin' }
      },
      {
        path: 'admin/interventions',
        name: 'AdminInterventions',
        component: AdminInterventions,
        meta: { role: 'admin' }
      },
      {
        path: 'admin/repeat-tracker',
        name: 'AdminRepeatTracker',
        component: AdminRepeatTracker,
        meta: { role: 'admin' }
      },
      {
        path: 'admin/mentorship',
        name: 'AdminMentorshipInbox',
        component: AdminMentorshipInbox,
        meta: { role: 'admin' }
      },
      {
        path: 'admin/notifications',
        name: 'AdminNotifications',
        component: AdminNotifications,
        meta: { role: 'admin' }
      },
      {
        path: 'admin/settings',
        name: 'AdminSettings',
        component: AdminSettings,
        meta: { role: 'admin' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Simulated Route Guards
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.public) {
    return next()
  }

  if (!auth.isAuthenticated) {
    return next('/login')
  }

  // Prevent cross-role navigation via URL typing
  if (to.meta.role && to.meta.role !== auth.currentRole) {
    // If student attempts to view admin/TA, redirect to student dashboard
    if (auth.isStudent) return next('/student/dashboard')
    if (auth.isTa) return next('/ta/dashboard')
    if (auth.isAdmin) return next('/admin/dashboard')
  }

  next()
})

export default router

