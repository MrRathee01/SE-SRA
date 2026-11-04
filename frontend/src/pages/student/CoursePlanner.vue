<template>
  <div class="space-y-6">
    <!-- Top Bar with Prerequisite Toggle & Advisor CTA -->
    <div class="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Interactive Degree & Course Planner</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          9-term roadmap aligned with IITM BS Foundation and Diploma progression milestones.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          :class="[
            'btn text-xs font-semibold',
            showPrereqMap ? 'btn-primary' : 'btn-secondary'
          ]"
          @click="showPrereqMap = !showPrereqMap"
        >
          <GitMerge class="w-4 h-4 mr-1.5" />
          {{ showPrereqMap ? 'Hide Prerequisite Map' : 'Show Prerequisite Map' }}
        </button>

        <button 
          type="button" 
          class="btn bg-navy-800 text-white hover:bg-navy-900 text-xs font-semibold"
          @click="showAdvisorModal = true"
        >
          <UserCheck class="w-4 h-4 mr-1.5" />
          Request Advisor Review
        </button>
      </div>
    </div>

    <!-- Feasibility Assessment Banner (AI Generated) -->
    <div 
      :class="[
        'card p-4 sm:p-5 border-l-4 transition-all',
        feasibility.onTrack ? 'border-l-emerald-500 bg-emerald-50/40' : 'border-l-amber-500 bg-amber-50/50'
      ]"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-start gap-3">
          <div 
            :class="[
              'p-2 rounded-xl shrink-0 mt-0.5',
              feasibility.onTrack ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            ]"
          >
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-900">
                Pacing Feasibility Assessment
              </h4>
              <span 
                :class="[
                  'text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider',
                  feasibility.onTrack ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                ]"
              >
                {{ feasibility.onTrack ? 'On Track' : 'Milestone Warning' }}
              </span>
            </div>
            <p class="text-xs text-slate-700 mt-1 leading-relaxed">
              {{ feasibility.message }}
            </p>
          </div>
        </div>

        <div class="sm:text-right shrink-0 bg-white/70 p-3 rounded-lg border border-slate-200">
          <span class="text-[11px] text-slate-500 block">Projected Completion</span>
          <span class="text-sm font-bold text-slate-900">Term {{ feasibility.projectedCompletionTerm }} of 9</span>
          <span class="text-[11px] text-amber-600 block font-medium">
            Requires ≥ {{ feasibility.recommendedRegistrationCount }} courses/term
          </span>
        </div>
      </div>
    </div>

    <!-- Visual Prerequisite Chain Flow (Tree View) -->
    <div v-if="showPrereqMap" class="card p-6 bg-slate-900 text-white animate-fadeIn">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <GitBranch class="w-5 h-5 text-blue-400" />
            Visual Prerequisite Dependency Graph
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Lines illustrate prerequisite unlocks. Courses marked in orange are historic program bottlenecks with repeat rates > 40%.
          </p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-emerald-500"></span> Completed</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-blue-500"></span> In Progress</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-500"></span> Bottleneck</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-slate-700"></span> Blocked</span>
        </div>
      </div>

      <!-- Graph Flow Columns -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto py-2">
        <!-- Stage 1 -->
        <div class="space-y-3">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            Foundation Entry (No Prereq)
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center justify-between">
            <span>CS1001 Computational Thinking</span>
            <Check class="w-4 h-4 text-emerald-400" />
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center justify-between">
            <span>MA1001 Maths for Data Science I</span>
            <Check class="w-4 h-4 text-emerald-400" />
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center justify-between">
            <span>MA1002 Stats for Data Science I</span>
            <Check class="w-4 h-4 text-emerald-400" />
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center justify-between">
            <span>HS1001 English I</span>
            <Check class="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <!-- Stage 2 -->
        <div class="space-y-3">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            Level 2 Core (Unlocks Diploma)
          </div>
          <div class="p-3 rounded-xl bg-amber-950/70 border border-amber-600 text-amber-200 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>CS1002 Python (OPPE)</span>
              <span class="block text-[10px] text-amber-400 mt-0.5">Bottleneck (66% repeat rate)</span>
            </div>
            <RefreshCw class="w-4 h-4 text-blue-400 animate-spin" />
          </div>
          <div class="p-3 rounded-xl bg-amber-950/70 border border-amber-600 text-amber-200 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>MA1003 Maths II</span>
              <span class="block text-[10px] text-amber-400 mt-0.5">Bottleneck (62% repeat rate)</span>
            </div>
            <Lock class="w-4 h-4 text-slate-400" />
          </div>
          <div class="p-3 rounded-xl bg-blue-950/80 border border-blue-600 text-blue-200 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>MA1004 Stats II</span>
              <span class="block text-[10px] text-slate-400 mt-0.5">In Progress</span>
            </div>
            <RefreshCw class="w-4 h-4 text-blue-400" />
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center justify-between">
            <span>HS1002 English II</span>
            <Check class="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <!-- Stage 3 -->
        <div class="space-y-3">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            Diploma in Programming
          </div>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>CS2001 DBMS</span>
              <span class="block text-[10px] text-slate-500 mt-0.5">Requires CS1002 pass</span>
            </div>
            <Lock class="w-4 h-4 text-slate-500" />
          </div>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>CS2002 PDSA (Python)</span>
              <span class="block text-[10px] text-slate-500 mt-0.5">Requires CS1002 pass</span>
            </div>
            <Lock class="w-4 h-4 text-slate-500" />
          </div>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>CS2003 MAD I</span>
              <span class="block text-[10px] text-slate-500 mt-0.5">Requires CS2001 & CS2002</span>
            </div>
            <Lock class="w-4 h-4 text-slate-500" />
          </div>
        </div>

        <!-- Stage 4 -->
        <div class="space-y-3">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            Diploma in Data Science
          </div>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>CS2004 Machine Learning Fnd.</span>
              <span class="block text-[10px] text-slate-500 mt-0.5">Requires MA1003 & MA1004</span>
            </div>
            <Lock class="w-4 h-4 text-slate-500" />
          </div>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>CS2005 ML Techniques</span>
              <span class="block text-[10px] text-slate-500 mt-0.5">Requires CS2004</span>
            </div>
            <Lock class="w-4 h-4 text-slate-500" />
          </div>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-between">
            <div>
              <span>MS2001P BDM Capstone</span>
              <span class="block text-[10px] text-slate-500 mt-0.5">Requires CS2001 & MA1004</span>
            </div>
            <Lock class="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Term-Wise Grid View (9 Terms Layout) -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Term-Wise Course Progression Grid</h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Click on any unlocked course to plan registration or view syllabus prerequisites.
          </p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> In Progress</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Blocked</span>
        </div>
      </div>

      <div class="overflow-x-auto pb-2">
        <div class="min-w-[900px] grid grid-cols-9 gap-3">
          <!-- Terms 1 to 9 Columns -->
          <div 
            v-for="col in termGrid" 
            :key="col.term"
            :class="[
              'rounded-xl border p-3 flex flex-col justify-between transition-all',
              col.term === student.termNumber 
                ? 'bg-navy-50/50 border-navy-400 ring-2 ring-navy-700 shadow-xs' 
                : 'bg-slate-50/60 border-slate-200'
            ]"
          >
            <!-- Term Column Header -->
            <div class="text-center pb-2.5 border-b border-slate-200 mb-2">
              <span class="text-xs font-bold text-slate-900 block">Term {{ col.term }}</span>
              <span 
                v-if="col.term === student.termNumber" 
                class="text-[10px] bg-navy-800 text-white font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5"
              >
                Current
              </span>
              <span v-else class="text-[10px] text-slate-400 block mt-0.5">
                {{ col.term < student.termNumber ? 'Past' : 'Future' }}
              </span>
            </div>

            <!-- Courses in this Term -->
            <div class="space-y-2 flex-1">
              <div 
                v-for="course in col.courses" 
                :key="course.code"
                :class="[
                  'p-2.5 rounded-lg border text-xs font-medium transition-all relative group',
                  getCourseCardClass(course)
                ]"
                :title="course.tooltip"
              >
                <div class="flex items-center justify-between gap-1">
                  <span class="font-bold truncate">{{ course.code }}</span>
                  <component :is="course.icon" class="w-3.5 h-3.5 shrink-0" />
                </div>
                <div class="text-[11px] truncate mt-0.5 text-slate-600">{{ course.name }}</div>

                <!-- Hover Tooltip if blocked -->
                <div 
                  v-if="course.isBlocked" 
                  class="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-44 p-2 bg-slate-900 text-white text-[10px] rounded shadow-lg z-20 pointer-events-none"
                >
                  🔒 {{ course.tooltip }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Registration Status Panel -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- This Term's Registered Courses -->
      <div class="card p-5">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          This Term's Registered Courses (Term {{ student.termNumber }})
        </h4>
        <div class="space-y-3">
          <div class="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
            <div>
              <div class="font-bold text-xs text-navy-800">CS1002 • Programming in Python</div>
              <div class="text-[11px] text-slate-600 mt-0.5">Registration: REPEAT_FULL_COURSE (Attempt 2)</div>
            </div>
            <span class="badge badge-warning">Ongoing Repeat</span>
          </div>

          <div class="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
            <div>
              <div class="font-bold text-xs text-navy-800">MA1004 • Statistics for Data Science II</div>
              <div class="text-[11px] text-slate-600 mt-0.5">Registration: NEW_COURSE (Attempt 1)</div>
            </div>
            <span class="badge badge-safe">On Schedule</span>
          </div>
        </div>
      </div>

      <!-- Available Courses for Next Term -->
      <div class="card p-5 flex flex-col justify-between">
        <div>
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Available for Next Term (Term 6)
          </h4>
          <div class="space-y-2.5">
            <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
              <div>
                <span class="font-semibold text-xs text-slate-900">MA1003 • Maths for Data Science II</span>
                <span class="block text-[11px] text-slate-500">Prerequisite MA1001 Cleared</span>
              </div>
              <button 
                type="button" 
                class="btn btn-secondary text-xs py-1 px-2.5"
                @click="planCourse('MA1003')"
              >
                + Add to Plan
              </button>
            </div>

            <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50 opacity-75">
              <div>
                <span class="font-semibold text-xs text-slate-700">CS2001 • Database Management Systems</span>
                <span class="block text-[11px] text-slate-500">Pending CS1002 Python clearance</span>
              </div>
              <span class="text-xs text-slate-400 flex items-center gap-1">
                <Lock class="w-3.5 h-3.5" /> Blocked
              </span>
            </div>
          </div>
        </div>

        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs mt-4">
          ⚠️ <strong>Milestone Pace Alert:</strong> You need to register for at least 2 courses in Term 6 to satisfy the 6-in-6 milestone rule and unlock Diploma prerequisites.
        </div>
      </div>
    </div>

    <!-- Advisor Review Modal -->
    <Modal
      :is-open="showAdvisorModal"
      title="Request Academic Advisor Review"
      subtitle="Submit your planned course roadmap for faculty/advisor approval"
      @close="showAdvisorModal = false"
    >
      <div class="space-y-4 text-xs sm:text-sm text-slate-700">
        <p>
          An academic advisor will inspect your past course attempts, current pace in Programming in Python, and confirm if your Term 6-9 plan satisfies the 6-in-6 and 8-in-9 progression rules.
        </p>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Questions or Notes for Advisor
          </label>
          <textarea 
            v-model="advisorMessage" 
            rows="4" 
            placeholder="e.g. Can I take MA1003 along with CS2001 if I pass Python this term?"
            class="w-full text-sm border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showAdvisorModal = false">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" @click="submitAdvisorReview">
          Submit for Review
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStudentStore } from '../../stores/studentStore'
import { useToastStore } from '../../stores/toastStore'
import Modal from '../../components/common/Modal.vue'
import {
  GitMerge,
  GitBranch,
  UserCheck,
  Sparkles,
  Lock,
  Check,
  RefreshCw
} from 'lucide-vue-next'

const studentStore = useStudentStore()
const toast = useToastStore()

const student = computed(() => studentStore.student)
const showPrereqMap = ref(false)
const showAdvisorModal = ref(false)
const advisorMessage = ref('')

const feasibility = computed(() => {
  return student.value?.feasibilityStatus || {
    onTrack: false,
    message: 'Progression pace at risk of missing 6-in-6.',
    projectedCompletionTerm: 9,
    recommendedRegistrationCount: 2
  }
})

// Build 9-term grid with courses
const termGrid = computed(() => {
  return [
    {
      term: 1,
      courses: [
        { code: 'CS1001', name: 'Comp. Thinking', status: 'completed', icon: Check, tooltip: 'Completed with Grade A' },
        { code: 'MA1001', name: 'Maths I', status: 'completed', icon: Check, tooltip: 'Completed with Grade B' }
      ]
    },
    {
      term: 2,
      courses: [
        { code: 'HS1001', name: 'English I', status: 'completed', icon: Check, tooltip: 'Completed with Grade S' },
        { code: 'MA1002', name: 'Stats I', status: 'completed', icon: Check, tooltip: 'Completed with Grade C' }
      ]
    },
    {
      term: 3,
      courses: [
        { code: 'HS1002', name: 'English II', status: 'completed', icon: Check, tooltip: 'Completed with Grade A' },
        { code: 'CS1002', name: 'Python (Att. 1)', status: 'fail', icon: RefreshCw, tooltip: 'Failed End-Term. Repeat required.' }
      ]
    },
    {
      term: 4,
      courses: [
        { code: 'BREAK', name: 'Term Drop / Break', status: 'dropped', icon: RefreshCw, tooltip: 'Term Break taken' }
      ]
    },
    {
      term: 5,
      courses: [
        { code: 'CS1002', name: 'Python (Att. 2)', status: 'in-progress', icon: RefreshCw, tooltip: 'Ongoing Repeat (GRPA 4 Due)' },
        { code: 'MA1004', name: 'Stats II', status: 'in-progress', icon: RefreshCw, tooltip: 'Ongoing First Attempt' }
      ]
    },
    {
      term: 6,
      courses: [
        { code: 'MA1003', name: 'Maths II', status: 'planned', icon: Sparkles, tooltip: 'Planned registration (Prereq cleared)' }
      ]
    },
    {
      term: 7,
      courses: [
        { code: 'CS2001', name: 'DBMS', status: 'blocked', isBlocked: true, icon: Lock, tooltip: 'Requires CS1002 to be completed first' },
        { code: 'CS2002', name: 'PDSA', status: 'blocked', isBlocked: true, icon: Lock, tooltip: 'Requires CS1002 to be completed first' }
      ]
    },
    {
      term: 8,
      courses: [
        { code: 'CS2003', name: 'MAD I', status: 'blocked', isBlocked: true, icon: Lock, tooltip: 'Requires CS2001 and CS2002 to be completed first' },
        { code: 'CS2004', name: 'ML Foundations', status: 'blocked', isBlocked: true, icon: Lock, tooltip: 'Requires MA1003 and MA1004 to be completed first' }
      ]
    },
    {
      term: 9,
      courses: [
        { code: 'CS2005', name: 'ML Techniques', status: 'blocked', isBlocked: true, icon: Lock, tooltip: 'Requires CS2004' },
        { code: 'MS2001P', name: 'BDM Capstone', status: 'blocked', isBlocked: true, icon: Lock, tooltip: 'Requires CS2001 and MA1004' }
      ]
    }
  ]
})

function getCourseCardClass(course) {
  if (course.status === 'completed') {
    return 'bg-emerald-50 text-emerald-900 border-emerald-300'
  }
  if (course.status === 'in-progress') {
    return 'bg-blue-50 text-blue-900 border-blue-400'
  }
  if (course.status === 'fail') {
    return 'bg-rose-50 text-rose-900 border-rose-300'
  }
  if (course.status === 'planned') {
    return 'bg-amber-50 text-amber-900 border-amber-300'
  }
  return 'bg-slate-100 text-slate-500 border-slate-200'
}

function planCourse(code) {
  studentStore.registerCourseForNextTerm(code)
}

function submitAdvisorReview() {
  studentStore.submitMentorshipRequest({
    subject: 'Course Planning',
    description: `[Advisor Review Request]: ${advisorMessage.value || 'Student requested evaluation of 9-term course completion trajectory.'}`,
    urgency: 'Normal',
    courses: ['CS1002', 'MA1003']
  })
  showAdvisorModal.value = false
  advisorMessage.value = ''
}
</script>

