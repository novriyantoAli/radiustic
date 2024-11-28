<template>
  <div class="flex justify-center w-full h-full overflow-hidden relative">
    <!-- <canvas ref="canvas" style="max-width: 100%"></canvas> -->
    <VaChart :data="chartData" class="h-24" type="line" :options="options" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ChartOptions } from 'chart.js'

import type { Revenues } from '../../../../data/charts/revenueChartData'

import { useAuthStore } from '../../../../stores/auth-store'
import VaChart from '../../../../components/va-charts/VaChart.vue'
import axios from 'axios'

// const { revenues, months } = defineProps<{
//   months: string[]
//   revenues: Revenues[]
// }>()

const months = ref<string[]>([])
const data = ref<number[]>([])

const chartData = computed(() => ({
  labels: months.value,
  datasets: [
    {
      label: 'Pencapaiian',
      data: data.value,
      backgroundColor: 'rgba(75,192,192,0.4)',
    },
  ],
}))

const options: ChartOptions<'line'> = {
  scales: {
    x: {
      display: true,
      grid: {
        display: false, // Disable X-axis grid lines ("net")
      },
    },
    y: {
      display: true,
      grid: {
        display: true, // Disable Y-axis grid lines ("net")
      },
      ticks: {
        display: false, // Hide Y-axis values
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
}

// Chart.register(...registerables)

// const BR_THICKNESS = 4

// Chart.register([
//   {
//     id: 'background-color',
//     beforeDatasetDraw: function (chart) {
//       const ctx = chart.ctx
//       const config = chart.config

//       config.data.datasets.forEach(function (dataset, datasetIndex) {
//         const meta = chart.getDatasetMeta(datasetIndex)
//         if (meta.type === 'bar') {
//           const bgColor = earningsColor

//           // Loop through each bar in the dataset
//           meta.data.forEach(function (bar) {
//             ctx.fillStyle = bgColor
//             ctx.fillRect(bar.x - BR_THICKNESS / 2, 0, BR_THICKNESS, chart.chartArea.bottom)
//           })
//         }
//       })
//     },
//   },
// ])

// const canvas = ref<HTMLCanvasElement | null>(null)

// const chrt = ref<Chart<"bar", number[], string>>()

// const doShowChart = ref(false)

// onMounted(() => {
//   if (canvas.value) {
//     const ctx = canvas.value.getContext('2d')
//     if (ctx) {
//       new Chart(ctx, {
//         type: 'bar',
//         data: {
//           labels: months.value,
//           datasets: [
//             {
//               // Show relative expenses ratio
//               data: data.value,
//               backgroundColor: expensesColor,
//               barThickness: BR_THICKNESS,
//             },
//           ],
//         },
//         options: {
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               display: false,
//             },
//           },
//           scales: {
//             x: {
//               stacked: true,
//               grid: {
//                 display: false,
//               },
//               border: {
//                 width: 0,
//               },
//             },
//             y: {
//               display: false,
//               beginAtZero: true,
//               ticks: {
//                 callback: function (value) {
//                   return formatMoney(Number(value))
//                 },
//               },
//             },
//           },
//         },
//       })
//     }
//   }

//   nextTick(() => {
//      doShowChart.value = true
//   })
// });

;(async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/year/current`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  const reve = res.data.data as Revenues[]
  for (let index = 0; index < res.data.data.length; index++) {
    months.value.push(res.data.data[index].month)
  }
  data.value = reve.map(({ earning, expenses }) => {
    console.log(earning)

    return expenses
    // if (earning == 0 || expenses == 0) {
    //   return 0;
    // }
    // return Math.round( (expenses / earning) * 100);
  })
})()
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
