<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">System Configuration & Risk Pipeline Settings</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Tune predictive model weights, calibrate risk thresholds, inspect milestone rules, and manage platform capacity.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          type="button" 
          class="btn btn-secondary text-xs text-rose-700 hover:bg-rose-50 border-rose-200"
          @click="showResetModal = true"
        >
          <RotateCcw class="w-3.5 h-3.5 mr-1.5" />
          Reset Demo Data
        </button>
      </div>
    </div>

    <!-- 2-Column: Left (Risk Weights & Thresholds), Right (Signal Toggles & TA Limits) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Risk Weights & Threshold Configuration -->
      <div class="card p-6 space-y-5">
        <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Sliders class="w-4 h-4 text-navy-700" />
          Predictive Risk Model Weightings
        </h3>
        <p class="text-xs text-slate-500">
          Adjust the relative impact weight of each diagnostic signal. Total sum: <strong>100%</strong>.
        </p>

        <div class="space-y-4 text-xs">
          <!-- Milestone Delay -->
          <div>
            <div class="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Milestone Pacing Delay (4-in-4, 6-in-6)</span>
              <span class="text-navy-800 font-bold">{{ weights.milestoneDelay }}%</span>
            </div>
            <input 
              type="range" 
              v-model.number="weights.milestoneDelay" 
              min="10" 
              max="50" 
              class="w-full accent-navy-800"
            />
          </div>

          <!-- Assignment & Quiz Lag -->
          <div>
            <div class="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Weekly Assignment & Quiz Score Lag</span>
              <span class="text-navy-800 font-bold">{{ weights.assignmentLag }}%</span>
            </div>
            <input 
              type="range" 
              v-model.number="weights.assignmentLag" 
              min="10" 
              max="40" 
              class="w-full accent-navy-800"
            />
          </div>

          <!-- OPPE Failures -->
          <div>
            <div class="flex justify-between font-semibold text-slate-700 mb-1">
              <span>OPPE Programming Exam Failures</span>
              <span class="text-navy-800 font-bold">{{ weights.oppeFailure }}%</span>
            </div>
            <input 
              type="range" 
              v-model.number="weights.oppeFailure" 
              min="10" 
              max="40" 
              class="w-full accent-navy-800"
            />
          </div>

          <!-- Repeat Course Counts -->
          <div>
            <div class="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Repeat Course Re-registration Count</span>
              <span class="text-navy-800 font-bold">{{ weights.repeatAttempts }}%</span>
            </div>
            <input 
              type="range" 
              v-model.number="weights.repeatAttempts" 
              min="5" 
              max="30" 
              class="w-full accent-navy-800"
            />
          </div>
        </div>

        <!-- Risk Thresholds (Critical vs At Risk) -->
        <div class="pt-4 border-t border-slate-100 space-y-3">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Classification Threshold Cutoffs
          </h4>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-rose-50 rounded-lg border border-rose-200">
              <label class="block font-bold text-rose-900 mb-1">🔴 Critical Threshold (Score ≥)</label>
              <input 
                type="number" 
                v-model.number="thresholds.criticalThreshold" 
                min="60" 
                max="90" 
                class="w-full text-sm font-bold border border-rose-300 rounded px-2 py-1 bg-white"
              />
            </div>

            <div class="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <label class="block font-bold text-amber-900 mb-1">🟡 At Risk Threshold (Score ≥)</label>
              <input 
                type="number" 
                v-model.number="thresholds.atRiskThreshold" 
                min="40" 
                max="70" 
                class="w-full text-sm font-bold border border-amber-300 rounded px-2 py-1 bg-white"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button type="button" class="btn btn-primary text-xs" @click="saveWeightsAndThresholds">
            Save Risk Weights & Thresholds
          </button>
        </div>
      </div>

      <!-- AI Signal Toggles & Capacity Management -->
      <div class="space-y-6">
        <!-- Signal Toggles -->
        <div class="card p-6 space-y-4">
          <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ToggleLeft class="w-4 h-4 text-navy-700" />
            Active Surveillance AI Signal Toggles
          </h3>
          <p class="text-xs text-slate-500">
            Enable or bypass specific automated data signals in the nightly risk calculation job.
          </p>

          <div class="divide-y divide-slate-100 text-xs">
            <div 
              v-for="(val, key) in settings.signalsEnabled" 
              :key="key"
              class="py-2.5 flex items-center justify-between"
            >
              <div>
                <span class="font-bold text-slate-800 capitalize block">
                  {{ formatSignalLabel(key) }}
                </span>
                <span class="text-[11px] text-slate-400">Streamed from LMS and examination databases</span>
              </div>
              <button 
                type="button" 
                :class="[
                  'w-10 h-6 rounded-full transition-colors relative flex items-center p-1',
                  val ? 'bg-navy-800 justify-end' : 'bg-slate-300 justify-start'
                ]"
                @click="settingsStore.toggleSignal(key)"
              >
                <span class="w-4 h-4 rounded-full bg-white shadow-xs"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- TA Capacity Management -->
        <div class="card p-6 space-y-4">
          <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Users class="w-4 h-4 text-navy-700" />
            Teaching Assistant Caseload Ceiling
          </h3>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                Maximum Student Load per Teaching Assistant
              </label>
              <div class="flex items-center gap-3">
                <input 
                  type="number" 
                  v-model.number="maxStudents"
                  min="10" 
                  max="50" 
                  class="w-32 text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
                />
                <button type="button" class="btn btn-secondary text-xs" @click="saveTaCap">
                  Update Ceiling
                </button>
              </div>
              <p class="text-[11px] text-slate-500 mt-1">
                TAs carrying more students than this limit will trigger automated workload balance warnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Official Program Milestone Rules (View & Confirm) -->
    <div class="card p-6">
      <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
        <ShieldCheck class="w-4 h-4 text-navy-700" />
        Official IITM BS Degree Progression Milestone Rules (Mandatory)
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <span class="font-bold text-sm text-navy-900 block">4-in-4 Checkpoint Rule</span>
          <p class="text-slate-600 leading-relaxed">
            Students must clear at least 4 Foundation courses within the first 4 terms from program intake to remain in good academic standing.
          </p>
          <span class="text-[10px] text-emerald-700 font-bold uppercase">Enforced Automatically</span>
        </div>

        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <span class="font-bold text-sm text-navy-900 block">6-in-6 Checkpoint Rule</span>
          <p class="text-slate-600 leading-relaxed">
            Students must clear at least 6 Foundation courses within 6 terms to remain eligible for Diploma course registrations.
          </p>
          <span class="text-[10px] text-emerald-700 font-bold uppercase">Enforced Automatically</span>
        </div>

        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <span class="font-bold text-sm text-navy-900 block">8-in-9 Final Foundation Deadline</span>
          <p class="text-slate-600 leading-relaxed">
            All 8 Foundation courses must be successfully completed within 9 enrolled terms to receive the Foundation Certificate.
          </p>
          <span class="text-[10px] text-emerald-700 font-bold uppercase">Enforced Automatically</span>
        </div>
      </div>
    </div>

    <!-- Notification Templates Configuration -->
    <div class="card p-6 space-y-4">
      <h3 class="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
        <FileCode class="w-4 h-4 text-navy-700" />
        Standardized Automated Notification Templates
      </h3>

      <div class="space-y-4">
        <div 
          v-for="tpl in settings.notificationTemplates" 
          :key="tpl.type"
          class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-slate-900">{{ tpl.name }} ({{ tpl.type }})</span>
            <span class="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono text-slate-700">Template</span>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-0.5">Subject</label>
            <input 
              type="text" 
              v-model="tpl.subject" 
              class="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-0.5">Template Body</label>
            <textarea 
              v-model="tpl.body" 
              rows="3" 
              class="w-full text-xs border border-slate-300 rounded p-2.5 bg-white focus:outline-none font-sans"
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button 
              type="button" 
              class="btn btn-secondary text-xs py-1 px-3"
              @click="saveTpl(tpl)"
            >
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Demo Confirmation Modal -->
    <Modal
      :is-open="showResetModal"
      title="Confirm Demo Data Reset"
      subtitle="Revert all changes and restore initial seed records"
      @close="showResetModal = false"
    >
      <div class="space-y-3 text-xs text-slate-700">
        <p>
          This operation will clear all modifications in your browser's LocalStorage and restore the default state:
        </p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Initial student records (Aditya Verma, Sneha Nair, etc.)</li>
          <li>Default TA allocations and workloads</li>
          <li>All original interventions and mentorship requests</li>
          <li>Default predictive risk factor weights</li>
        </ul>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showResetModal = false">Cancel</button>
        <button type="button" class="btn btn-danger" @click="confirmReset">Confirm & Reset Demo Data</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore'
import { useAuthStore } from '../../stores/authStore'
import { useToastStore } from '../../stores/toastStore'
import Modal from '../../components/common/Modal.vue'
import { Sliders, ToggleLeft, Users, ShieldCheck, FileCode, RotateCcw } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const toast = useToastStore()

const settings = computed(() => settingsStore.settings)
const weights = ref({ ...settings.value.riskWeights })
const thresholds = ref({ ...settings.value.riskThresholds })
const maxStudents = ref(settings.value.taManagement.maxStudentsPerTa || 25)
const showResetModal = ref(false)

function formatSignalLabel(key) {
  const map = {
    milestonePace: 'Milestone Pace Analysis (4-in-4, 6-in-6)',
    assignmentSubmission: 'Weekly Graded Assignment Submissions',
    quizPerformance: 'In-Term Quiz Score Trajectory',
    oppeFailures: 'Online Proctored Exam (OPPE) Clearances',
    repeatAttempts: 'Course Re-registration & Retries',
    forumInactivity: 'LMS & Discussion Forum Activity'
  }
  return map[key] || key
}

function saveWeightsAndThresholds() {
  settingsStore.updateRiskWeights(weights.value)
  settingsStore.updateThresholds(thresholds.value)
}

function saveTaCap() {
  settingsStore.updateTaCapacity(maxStudents.value)
}

function saveTpl(tpl) {
  settingsStore.saveTemplate(tpl.type, tpl)
}

function confirmReset() {
  authStore.resetPlatformData()
  showResetModal.value = false
  toast.success('Platform data has been reset to defaults.')
  window.location.reload()
}
</script>

