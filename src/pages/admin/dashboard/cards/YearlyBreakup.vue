<template>
  <VaCard>
    <VaCardTitle class="pb-0!">
      <h1 class="card-title text-secondary font-bold uppercase">ORDERAN HOTSPOT BULAN INI</h1>
    </VaCardTitle>
    <VaCardContent class="flex flex-row gap-1">
      <section class="w-1/2">
        <div class="text-xl font-bold mb-2">{{ orderCurrentHotspot }}</div>
        <p class="text-xs text-success whitespace-nowrap">
          <VaIcon name="arrow_outward" />
          {{ growth }}%
          <span class="text-secondary"> bulan terakhir</span>
        </p>
        <div class="my-4 gap-2 flex flex-col">
          <div class="flex items-center">
            <span class="inline-block w-2 h-2 mr-2" :style="{ backgroundColor: earningsBackground }"></span>
            <span class="text-secondary">{{ otherPkg }}</span>
          </div>
          <div class="flex items-center">
            <span class="inline-block w-2 h-2 mr-2" :style="{ backgroundColor: profitBackground }"></span>
            <span class="text-secondary">{{ winningPkg }}</span>
          </div>
        </div>
      </section>
      <div class="w-1/2 flex items-center h-full flex-1 lg:pl-16 pl-2 -mr-1">
        <VaChart
          v-if="chartData"
          :data="chartData"
          class="chart chart--donut h-[90px] w-[90px]"
          type="doughnut"
          :options="options"
        />
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VaCard } from 'vuestic-ui'
import VaChart from '../../../../components/va-charts/VaChart.vue'
import { profitBackground, earningsBackground } from '../../../../data/charts/doughnutChartData'
import { doughnutConfig } from '../../../../components/va-charts/vaChartConfigs'
import { ChartOptions } from 'chart.js'
import { externalTooltipHandler } from '../../../../components/va-charts/external-tooltip'
import { useAuthStore } from '../../../../stores/auth-store'
import axios from 'axios'

const otherPkg = ref('paket lain')
const winningPkg = ref('paket pilihan')
const growth = ref(0.0)

const chartLabel = ref<string[]>(['-', 'paket lain'])
const chartDatax = ref<number[]>([0, 0])

// const chartData = useChartData(oke(chartLabel, chartDatax))

const chartData = computed(() => ({
  labels: chartLabel.value,
  datasets: [
    {
      label: 'Bulan ini',
      data: chartDatax.value,
      backgroundColor: [profitBackground, earningsBackground],
    },
  ],
}))

const orderCurrentHotspot = ref(0)

const options: ChartOptions<'doughnut'> = {
  ...doughnutConfig,
  plugins: {
    ...doughnutConfig.plugins,
    tooltip: {
      // Chart to small to show tooltips
      enabled: false,
      position: 'nearest',
      external: externalTooltipHandler,
    },
  },
}

;(async () => {
  // mengambil data dari sever
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/report/hotspot/month`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  chartLabel.value = [res.data.data.winning, 'paket lainnya']
  chartDatax.value = [res.data.data.winning_data, res.data.data.other_data]
  orderCurrentHotspot.value = res.data.data.month_current
  winningPkg.value = res.data.data.winning

  growth.value = Math.round((res.data.data.month_breakdown / res.data.data.month_current) * 100)
})()
</script>
