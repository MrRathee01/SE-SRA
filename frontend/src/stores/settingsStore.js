import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockDataService } from '../services/mock/mockDataService'
import { useToastStore } from './toastStore'

export const useSettingsStore = defineStore('settings', () => {
  const toast = useToastStore()
  const settings = ref(mockDataService.getSettings())

  function updateRiskWeights(weights) {
    settings.value.riskWeights = { ...weights }
    mockDataService.updateSettings(settings.value)
    toast.success('Risk factor weights updated.')
  }

  function updateThresholds(thresholds) {
    settings.value.riskThresholds = { ...thresholds }
    mockDataService.updateSettings(settings.value)
    toast.success('Risk thresholds updated.')
  }

  function toggleSignal(signalKey) {
    if (settings.value.signalsEnabled[signalKey] !== undefined) {
      settings.value.signalsEnabled[signalKey] = !settings.value.signalsEnabled[signalKey]
      mockDataService.updateSettings(settings.value)
      toast.info(`AI signal "${signalKey}" ${settings.value.signalsEnabled[signalKey] ? 'enabled' : 'disabled'}.`)
    }
  }

  function updateTaCapacity(maxStudents) {
    settings.value.taManagement.maxStudentsPerTa = Number(maxStudents)
    mockDataService.updateSettings(settings.value)
    toast.success('TA student capacity threshold updated.')
  }

  function saveTemplate(type, templateData) {
    const idx = settings.value.notificationTemplates.findIndex(t => t.type === type)
    if (idx !== -1) {
      settings.value.notificationTemplates[idx] = { ...templateData }
      mockDataService.updateSettings(settings.value)
      toast.success('Notification template saved.')
    }
  }

  return {
    settings,
    updateRiskWeights,
    updateThresholds,
    toggleSignal,
    updateTaCapacity,
    saveTemplate
  }
})

