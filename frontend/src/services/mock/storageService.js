// Storage Service with LocalStorage persistence and fallback
const STORAGE_PREFIX = 'iitm_risk_platform_'

export const StorageKeys = {
  CURRENT_USER: `${STORAGE_PREFIX}current_user`,
  STUDENTS: `${STORAGE_PREFIX}students`,
  TAS: `${STORAGE_PREFIX}tas`,
  INTERVENTIONS: `${STORAGE_PREFIX}interventions`,
  MENTORSHIP_REQUESTS: `${STORAGE_PREFIX}mentorship_requests`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
  ACTIVITY_FEED: `${STORAGE_PREFIX}activity_feed`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  TA_NOTES: `${STORAGE_PREFIX}ta_notes`,
  STUDENT_NOTIF_PREFS: `${STORAGE_PREFIX}student_notif_prefs`
}

export const storageService = {
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item)
    } catch (e) {
      console.warn(`Error reading from localStorage key "${key}":`, e)
      return defaultValue
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.warn(`Error writing to localStorage key "${key}":`, e)
      return false
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e)
      return false
    }
  },

  clearAllPlatformData() {
    try {
      Object.values(StorageKeys).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (e) {
      console.error('Error clearing platform data:', e)
      return false
    }
  }
}

