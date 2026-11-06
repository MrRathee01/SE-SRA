<template>
  <div class="space-y-6">
    <header>
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700">Progression monitoring</p>
      <h2 class="mt-1 text-2xl font-bold tracking-tight text-slate-900">Skip-term tracker</h2>
      <p class="mt-1 max-w-2xl text-sm text-slate-500">A focused view of students whose study breaks may affect their degree timeline.</p>
    </header>

    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div class="card p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Students with a skip term</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">{{ studentsWithSkips.length }}</p>
      </div>
      <div v-for="level in levelMetrics" :key="level.key" class="card p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">{{ level.label }}</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">{{ level.count }}</p>
        <p class="mt-1 text-xs text-slate-400">students with a skip term</p>
      </div>
    </section>

    <section class="card p-5 sm:p-6">
      <div class="mb-4">
        <h3 class="font-bold text-slate-900">Skip-term distribution</h3>
        <p class="mt-1 text-xs text-slate-500">Students grouped by the number of terms paused.</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div v-for="bucket in distribution" :key="bucket.label" class="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm font-medium text-slate-700">{{ bucket.label }}</span>
            <span class="text-lg font-bold text-slate-900">{{ bucket.count }}</span>
          </div>
          <div class="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div class="h-full rounded-full bg-blue-600" :style="{ width: `${bucket.percent}%` }"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="card overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 class="font-bold text-slate-900">Students with multiple skip terms</h3>
          <p class="mt-1 text-xs text-slate-500">Review students with two or more breaks and connect them with support.</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <label class="relative">
            <Search class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input v-model="search" type="search" placeholder="Search students" class="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs sm:w-52">
          </label>
          <select v-model="levelFilter" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs">
            <option value="ALL">All levels</option>
            <option v-for="level in levelMetrics" :key="level.key" :value="level.key">{{ level.label }}</option>
          </select>
        </div>
      </div>

      <div v-if="filteredStudents.length" class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr>
              <th class="table-header">Student</th>
              <th class="table-header">Skip terms</th>
              <th class="table-header">Current level / term</th>
              <th class="table-header">Risk</th>
              <th class="table-header">Assigned TA</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-slate-50">
              <td class="table-cell">
                <router-link :to="`/admin/students/${student.id}`" class="font-semibold text-navy-800 hover:underline">{{ student.name }}</router-link>
                <span class="mt-0.5 block text-[11px] text-slate-400">{{ student.rollNumber }}</span>
              </td>
              <td class="table-cell">
                <span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">{{ student.skipTerms }}</span>
                <span class="mt-1 block max-w-xs text-[11px] text-slate-500">{{ student.skipTermsHistory?.map(item => item.reason).filter(Boolean).join(' · ') || 'Reason not recorded' }}</span>
              </td>
              <td class="table-cell text-xs text-slate-700">{{ levelLabel(student.currentLevel) }} · Term {{ student.termNumber }}</td>
              <td class="table-cell"><RiskBadge :level="student.riskLevel" /></td>
              <td class="table-cell text-xs text-slate-600">{{ taName(student.assignedTaId) || 'Unassigned' }}</td>
              <td class="table-cell">
                <div class="flex justify-end gap-2">
                  <button type="button" class="btn btn-secondary whitespace-nowrap text-[11px]" @click="flagStudent(student)">Flag for review</button>
                  <button type="button" class="btn btn-primary whitespace-nowrap text-[11px]" @click="adminStore.openAssignmentWizard(student)">Assign mentor</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-10 text-center text-sm text-slate-500">No students with multiple skip terms match these filters.</div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { mockDataService } from '../../services/mock/mockDataService'
import { useAdminStore } from '../../stores/adminStore'
import RiskBadge from '../../components/common/RiskBadge.vue'
import { Search } from 'lucide-vue-next'

const adminStore = useAdminStore()
const search = ref('')
const levelFilter = ref('ALL')

const studentsWithSkips = computed(() => adminStore.allStudents.filter(student => Number(student.skipTerms) > 0))

const levelMetrics = computed(() => {
  const levels = [
    { key: 'FOUNDATION', label: 'Foundation' },
    { key: 'DIPLOMA', label: 'Diploma' },
    { key: 'DEGREE', label: 'Degree' }
  ]
  return levels.map(level => ({
    ...level,
    count: studentsWithSkips.value.filter(student => student.currentLevel === level.key).length
  }))
})

const distribution = computed(() => {
  const skipped = studentsWithSkips.value
  const groups = [
    { label: '1 term', match: count => count === 1 },
    { label: '2 terms', match: count => count === 2 },
    { label: '3+ terms', match: count => count >= 3 }
  ]
  return groups.map(group => {
    const count = skipped.filter(student => group.match(Number(student.skipTerms) || 0)).length
    return { label: group.label, count, percent: skipped.length ? Math.round((count / skipped.length) * 100) : 0 }
  })
})

const filteredStudents = computed(() => {
  const query = search.value.trim().toLowerCase()
  return studentsWithSkips.value
    .filter(student => Number(student.skipTerms) >= 2)
    .filter(student => levelFilter.value === 'ALL' || student.currentLevel === levelFilter.value)
    .filter(student => !query || student.name.toLowerCase().includes(query) || student.rollNumber.toLowerCase().includes(query))
    .sort((a, b) => Number(b.skipTerms) - Number(a.skipTerms))
})

function levelLabel(level) {
  return level ? level.charAt(0) + level.slice(1).toLowerCase() : 'Not set'
}

function taName(taId) {
  return mockDataService.getTaById(taId)?.name
}

function flagStudent(student) {
  adminStore.flagStudent(
    student.id,
    student.riskLevel === 'Critical' ? 'Critical' : 'At Risk',
    `Multiple skip terms recorded (${student.skipTerms}); review academic progression and support needs.`
  )
}
</script>
