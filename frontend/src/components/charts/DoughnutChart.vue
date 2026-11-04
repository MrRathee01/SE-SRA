<template>
  <div class="w-full h-full min-h-[220px] relative flex items-center justify-center">
    <Doughnut :data="chartData" :options="mergedOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['segment-click'])

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { family: 'Inter', size: 12 },
        color: '#475569',
        boxWidth: 12,
        padding: 14,
        usePointStyle: true
      }
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { family: 'Inter', size: 13, weight: '600' },
      bodyFont: { family: 'Inter', size: 12 },
      padding: 10,
      cornerRadius: 8
    }
  },
  onClick: (event, elements) => {
    if (elements && elements.length > 0) {
      const index = elements[0].index
      const label = props.chartData.labels[index]
      const value = props.chartData.datasets[0].data[index]
      emit('segment-click', { index, label, value })
    }
  }
}

const mergedOptions = computed(() => {
  return { ...defaultOptions, ...props.options }
})
</script>

