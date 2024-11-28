<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-tag text-secondary font-bold uppercase">ORDERAN KLIEN BULAN INI</h1>
    </VaCardTitle>
    <VaCardContent>
      <section>
        <div class="text-xl font-bold mb-2">{{ monthCurrent }}</div>
        <p class="text-xs text-success">
          <VaIcon name="arrow_upward" />
          {{ growth }}%
          <span class="text-secondary"> last month</span>
        </p>
      </section>
      <div class="w-full flex items-center">
        <VaChart :data="chartData" class="h-24" type="line" :options="options" />
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VaCard } from 'vuestic-ui'
import VaChart from '../../../../components/va-charts/VaChart.vue'
import { useAuthStore } from '../../../../stores/auth-store'
import { ChartOptions } from 'chart.js'
import axios from 'axios'

// const chartData = useChartData(lineChartData)

const monthCurrent = ref(0)
const growth = ref(0.0)

const chartLabel = ref<string[]>([])
const chartDatax = ref<number[]>([])

const chartData = computed(() => ({
  labels: chartLabel.value,
  datasets: [
    {
      label: 'Pencapaiian',
      data: chartDatax.value,
      backgroundColor: 'rgba(75,192,192,0.4)',
    },
  ],
}))

;(async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/report/client/month`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })

  monthCurrent.value = res.data.data.month_current

  chartLabel.value = res.data.data.month_name
  chartDatax.value = res.data.data.month_achievement

  growth.value = Math.round((res.data.data.month_breakdown / res.data.data.month_current) * 100)
})()

const options: ChartOptions<'line'> = {
  scales: {
    x: {
      display: false,
      grid: {
        display: false, // Disable X-axis grid lines ("net")
      },
    },
    y: {
      display: false,
      grid: {
        display: false, // Disable Y-axis grid lines ("net")
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
</script>
