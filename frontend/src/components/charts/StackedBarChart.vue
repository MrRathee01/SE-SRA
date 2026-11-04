<template>
  <div class="w-full h-full min-h-[240px] relative">
    <Bar :data="chartData" :options="mergedOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
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

const emit = defineEmits(['bar-click'])

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { family: 'Inter', size: 12 },
        color: '#475569',
        boxWidth: 12,
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
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' }
    },
    y: {
      stacked: true,
      grid: { color: '#f1f5f9' },
      ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' }
    }
  },
  onClick: (event, elements) => {
    if (elements && elements.length > 0) {
      const el = elements[0]
      const datasetIndex = el.datasetIndex
      const index = el.index
      const datasetLabel = props.chartData.datasets[datasetIndex].label
      const xLabel = props.chartData.labels[index]
      emit('bar-click', { datasetIndex, index, datasetLabel, xLabel })
    }
  }
}

const mergedOptions = computed(() => {
  return { ...defaultOptions, ...props.options }
})
</script>

