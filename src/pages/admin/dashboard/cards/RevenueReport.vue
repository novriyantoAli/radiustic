<template>
  <VaCard class="flex flex-col">
    <VaCardTitle class="flex items-start justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Laporan Pendapatan</h1>
      <div class="flex gap-2">
        <VaSelect v-model="selectedMonth" preset="small" :options="monthsWithCurrentYear" class="w-24" />
        <VaButton class="h-2" size="small" preset="primary" @click="exportAsCSV">Export</VaButton>
      </div>
    </VaCardTitle>
    <VaCardContent class="flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 h-full">
      <section class="flex flex-col items-start w-full sm:w-1/3 md:w-2/5 lg:w-1/4 gap-2 md:gap-8 pl-4">
        <div>
          <p class="text-xl font-semibold">{{ formatMoney(transactionToday) }}</p>
          <p class="whitespace-nowrap mt-2">Transaksi hari ini</p>
        </div>
        <div class="flex flex-col sm:flex-col gap-2 md:gap-8 w-full">
          <div>
            <div class="flex items-center">
              <span class="inline-block w-2 h-2 mr-2 -ml-4" :style="{ backgroundColor: earningsColor }"></span>
              <span class="text-secondary">Piutang bulan ini</span>
            </div>
            <div class="mt-2 text-xl font-semibold">{{ formatMoney(credit) }}</div>
          </div>
          <div>
            <div class="flex items-center">
              <span class="inline-block w-2 h-2 mr-2 -ml-4" :style="{ backgroundColor: expensesColor }"></span>
              <span class="text-secondary">Penerimaan bulan ini</span>
            </div>
            <div class="mt-2 text-xl font-semibold">{{ formatMoney(debt) }}</div>
          </div>
        </div>
      </section>
      <RevenueReportChart class="w-2/3 md:w-3/5 lg:w-3/4 h-full min-h-72 sm:min-h-32 pt-4" />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VaCard } from 'vuestic-ui'
import RevenueReportChart from './RevenueReportChart.vue'
import { downloadAsCSV } from '../../../../services/toCSV'
import {
  earningsColor,
  expensesColor,
  months,
  generateRevenues,
  formatMoney,
} from '../../../../data/charts/revenueChartData'
import axios from 'axios'
import { useAuthStore } from '../../../../stores/auth-store'

const revenues = generateRevenues(months)

const currentYear = new Date().getFullYear()
const monthsWithCurrentYear = months.map((month) => `${month} ${currentYear}`)

const selectedMonth = ref(monthsWithCurrentYear[0])

const transactionToday = ref(0)

const credit = ref(0)

const debt = ref(0)

const exportAsCSV = () => {
  downloadAsCSV(revenues, 'revenue-report')
}

;(async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/today/count`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  transactionToday.value = res.data.data
})()
;(async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/month/current`, {
    headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
  })
  credit.value = res.data.data.credit - res.data.data.debt
  debt.value = res.data.data.debt
})()
</script>
