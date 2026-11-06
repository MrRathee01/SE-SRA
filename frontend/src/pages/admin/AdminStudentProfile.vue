<template>
  <div v-if="student" class="space-y-6">
    <!-- Top Header -->
    <div class="card p-6 bg-white border border-slate-200">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <InitialsAvatar :name="student.name" role="student" size="xl" />
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900">{{ student.name }}</h2>
              <RiskBadge :level="student.riskLevel" />
              <span class="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Risk Score: {{ student.riskScore || 68 }}/100
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              Roll No: <strong>{{ student.rollNumber }}</strong> • {{ student.currentLevel }} • Term {{ student.termNumber }} of {{ student.totalTerms }} • Program: {{ student.program }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <button 
            type="button" 
            class="btn btn-outline-primary text-xs"
            @click="adminStore.openAssignmentWizard(student)"
          >
            <UserCheck class="w-3.5 h-3.5 mr-1.5" />
            {{ student.assignedTaId ? 'Reassign TA' : 'Assign TA' }}
          </button>
          <button 
            type="button" 
            class="btn btn-primary text-xs"
            @click="showInterventionModal = true"
          >
            <PlusCircle class="w-3.5 h-3.5 mr-1.5" />
            Log Program Intervention
          </button>
        </div>
      </div>
    </div>

    <!-- 2-Column: Left 2 Cols (Tabs), Right 1 Col (TA Assignment Panel & AI Breakdown) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <!-- Sub-Tabs Navigation -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            type="button"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0',
              activeTab === 'academic' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="activeTab = 'academic'"
          >
            Academic History
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0',
              activeTab === 'repeats' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="activeTab = 'repeats'"
          >
            Repeat Course Tracker (Tagged)
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0',
              activeTab === 'interventions' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="activeTab = 'interventions'"
          >
            All Program Interventions
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0',
              activeTab === 'mentorship' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="activeTab = 'mentorship'"
          >
            Mentorship Inquiries ({{ studentMentorshipRequests.length }})
          </button>
        </div>

        <!-- TAB 1: ACADEMIC HISTORY -->
        <div v-if="activeTab === 'academic'" class="card p-5 space-y-4">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Course Registrations & Historical Grades
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="table-header">Course Name</th>
                  <th class="table-header">Term</th>
                  <th class="table-header">Grade</th>
                  <th class="table-header">Attempts</th>
                  <th class="table-header">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="c in student.courseHistory || []" :key="c.courseCode">
                  <td class="table-cell font-bold text-slate-900">
                    {{ c.courseName }}
                    <span class="block text-[11px] font-normal text-slate-400">{{ c.courseCode }}</span>
                  </td>
                  <td class="table-cell text-xs text-slate-600">{{ c.term }}</td>
                  <td class="table-cell font-bold text-xs">{{ c.grade }}</td>
                  <td class="table-cell text-xs">
                    <span v-if="c.attempts > 1" class="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                      Attempt {{ c.attempts }}
                    </span>
                    <span v-else>1</span>
                  </td>
                  <td class="table-cell">
                    <StatusBadge :status="c.status" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: REPEAT COURSE TRACKER WITH PERSISTENT DIFFICULTY TAG -->
        <div v-if="activeTab === 'repeats'" class="card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900">Repeat Course Surveillance Panel</h3>
              <p class="text-xs text-slate-500 mt-0.5">Courses attempted 2+ times with admin pattern tagging.</p>
            </div>
            <button 
              type="button" 
              class="btn btn-warning text-xs font-bold"
              @click="tagPersistentDifficulty"
            >
              Tag: Persistent Difficulty
            </button>
          </div>

          <!-- Tag display if tagged -->
          <div 
            v-if="isTaggedDifficulty" 
            class="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-center justify-between"
          >
            <span>🏷️ <strong>Official Pattern Tagged:</strong> Persistent Difficulty — Referred for Academic Support & Tutoring.</span>
            <button type="button" class="text-amber-700 hover:underline" @click="isTaggedDifficulty = false">Remove Tag</button>
          </div>

          <div class="space-y-3">
            <div 
              v-for="rep in repeatCourses" 
              :key="rep.courseCode"
              class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 text-sm">{{ rep.courseCode }} • {{ rep.courseName }}</span>
                <span class="badge badge-warning">Attempt {{ rep.attempts }}</span>
              </div>
              <p class="text-slate-600">
                Prior attempt in Term 3 resulted in Grade U (Score 42%). Currently enrolled in Term 5 repeat cohort.
              </p>
            </div>
            <div v-if="repeatCourses.length === 0" class="text-center py-6 text-slate-400 text-xs">
              No repeat courses on record for this student.
            </div>
          </div>
        </div>

        <!-- TAB 3: ALL INTERVENTIONS -->
        <div v-if="activeTab === 'interventions'" class="card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900">Intervention Log Across All TAs</h3>
            <button 
              type="button" 
              class="btn btn-primary text-xs"
              @click="showInterventionModal = true"
            >
              + Log New Intervention
            </button>
          </div>

          <div class="space-y-3">
            <div 
              v-for="item in studentInterventions" 
              :key="item.id"
              class="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-slate-900 text-sm">{{ item.type }}</span>
                  <span class="text-slate-500 ml-2">by {{ item.taName }}</span>
                </div>
                <StatusBadge :status="item.outcome" />
              </div>
              <p class="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {{ item.notes }}
              </p>
            </div>
            <div v-if="studentInterventions.length === 0" class="text-center py-6 text-slate-400 text-xs">
              No interventions recorded yet.
            </div>
          </div>
        </div>

        <!-- TAB 4: MENTORSHIP REQUESTS -->
        <div v-if="activeTab === 'mentorship'" class="card p-6 space-y-4">
          <h3 class="text-base font-bold text-slate-900">Mentorship Inquiries & Inline Admin Response</h3>
          <div class="space-y-4">
            <div 
              v-for="req in studentMentorshipRequests" 
              :key="req.id"
              class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-slate-900 text-sm">{{ req.subject }}</span>
                  <span v-if="req.urgency === 'Urgent'" class="ml-2 bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                    Urgent
                  </span>
                </div>
                <StatusBadge :status="req.status" />
              </div>

              <p class="text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                {{ req.description }}
              </p>

              <!-- Inline Admin Response Box -->
              <div class="pt-2 border-t border-slate-200 space-y-2">
                <label class="block font-semibold text-slate-800">Admin Response & Actions</label>
                <textarea 
                  v-model="responseInputs[req.id]"
                  rows="2"
                  class="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none"
                  :placeholder="req.adminResponse ? req.adminResponse : 'Type response to student or instructions...'"
                ></textarea>

                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="text-slate-500">Route to TA:</span>
                    <select 
                      v-model="routeTaInputs[req.id]"
                      class="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none"
                    >
                      <option value="">Do not reassign</option>
                      <option v-for="ta in adminStore.allTas" :key="ta.id" :value="ta.id">
                        {{ ta.name }}
                      </option>
                    </select>
                  </div>

                  <button 
                    type="button" 
                    class="btn btn-primary text-xs py-1 px-3"
                    @click="submitAdminResponse(req.id)"
                  >
                    Send Response & Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: TA Assignment Panel & Risk Breakdown -->
      <div class="space-y-5">
        <!-- TA Assignment Panel -->
        <div class="card p-5 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Assigned TA</h3>
            <span class="badge badge-safe">Faculty Support</span>
          </div>

          <div v-if="currentTa" class="space-y-3">
            <div class="flex items-center gap-3">
              <InitialsAvatar :name="currentTa.name" role="ta" size="lg" />
              <div>
                <h4 class="font-bold text-slate-900 text-sm">{{ currentTa.name }}</h4>
                <p class="text-xs text-slate-500">{{ currentTa.role }}</p>
                <p class="text-xs text-navy-700 font-semibold">{{ currentTa.department }}</p>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
              <div><strong>Email:</strong> {{ currentTa.email }}</div>
              <div><strong>Caseload:</strong> {{ currentTa.assignedCount }} students ({{ currentTa.atRiskCount }} at-risk)</div>
              <div><strong>Expertise:</strong> {{ currentTa.expertise?.join(', ') }}</div>
            </div>

            <button 
              type="button" 
              class="btn btn-secondary w-full text-xs font-semibold"
              @click="adminStore.openAssignmentWizard(student)"
            >
              Reassign Teaching Assistant
            </button>
          </div>

          <div v-else class="text-center py-6 text-slate-400 text-xs">
            No Teaching Assistant assigned.
            <button 
              type="button" 
              class="btn btn-primary w-full text-xs font-semibold mt-3"
              @click="adminStore.openAssignmentWizard(student)"
            >
              Assign a Teaching Assistant
            </button>
          </div>

          <!-- Assignment History -->
          <div class="pt-3 border-t border-slate-100 text-xs space-y-2">
            <span class="font-semibold text-slate-800 uppercase text-[10px] tracking-wider block">Assignment Ledger</span>
            <div class="text-slate-500 text-[11px] space-y-1">
              <div>• Oct 28: Assigned to Dr. Priya Ramachandran by Admin Cell</div>
              <div>• Sep 15: Initial allocation upon Term 5 registration</div>
            </div>
          </div>
        </div>

        <!-- AI Risk Score Breakdown & Signal Weights -->
        <div class="card p-5 space-y-3 bg-slate-50/70 border border-slate-200">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Risk Score Breakdown</h3>
            <span class="font-bold text-sm text-navy-800">{{ student.riskScore || 68 }}/100</span>
          </div>
          <p class="text-[11px] text-slate-500">
            Formulation based on weighted linear risk aggregation:
          </p>

          <div class="space-y-2 text-xs">
            <div>
              <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                <span>Milestone Delay (35% weight)</span>
                <span>25 pts</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-navy-800 h-full w-[70%]"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                <span>Assignment / Quiz Lag (25% weight)</span>
                <span>15 pts</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-600 h-full w-[60%]"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                <span>OPPE Exam Clearance (25% weight)</span>
                <span>20 pts</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-rose-600 h-full w-[80%]"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                <span>Course Repeat Count (15% weight)</span>
                <span>8 pts</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-full w-[50%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Intervention Modal -->
    <InterventionModal
      :is-open="showInterventionModal"
      :student="student"
      @close="showInterventionModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockDataService } from '../../services/mock/mockDataService'
import { useAdminStore } from '../../stores/adminStore'
import { useToastStore } from '../../stores/toastStore'
import RiskBadge from '../../components/common/RiskBadge.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import InitialsAvatar from '../../components/common/InitialsAvatar.vue'
import InterventionModal from '../../components/modals/InterventionModal.vue'
import { UserCheck, PlusCircle } from 'lucide-vue-next'

const route = useRoute()
const adminStore = useAdminStore()
const toast = useToastStore()

const studentId = computed(() => route.params.id || 'student-demo')
const student = computed(() => mockDataService.getStudentById(studentId.value) || mockDataService.getStudentById('student-demo'))

const activeTab = ref('academic')
const showInterventionModal = ref(false)
const isTaggedDifficulty = ref(false)

const responseInputs = ref({})
const routeTaInputs = ref({})

const currentTa = computed(() => {
  if (!student.value?.assignedTaId) return null
  return mockDataService.getTaById(student.value.assignedTaId)
})

const studentInterventions = computed(() => {
  return mockDataService.getInterventionsForStudent(student.value.id)
})

const studentMentorshipRequests = computed(() => {
  return mockDataService.getMentorshipRequestsForStudent(student.value.id)
})

const repeatCourses = computed(() => {
  return (student.value?.courseHistory || []).filter(c => c.attempts > 1)
})

function tagPersistentDifficulty() {
  isTaggedDifficulty.value = true
  toast.success(`Tagged ${student.value.name} for Persistent Academic Difficulty.`)
}

function submitAdminResponse(requestId) {
  const text = responseInputs.value[requestId] || 'Reviewed and actioned by Academic Coordination Cell.'
  const routeTa = routeTaInputs.value[requestId] || null
  mockDataService.respondToMentorshipRequest(requestId, text, 'Actioned', routeTa)
  toast.success('Response dispatched to student!')
}
</script>

