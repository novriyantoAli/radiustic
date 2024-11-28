<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Top Lokasi Online</h1>
    </VaCardTitle>
    <VaCardContent class="flex flex-col gap-1">
      <div class="flex justify-between">
        <VaButtonToggle v-model="selectedPeriod" :options="periods" color="background-element" size="small" />

        <VaButton preset="primary" size="small"> Export </VaButton>
      </div>

      <VaDataTable
        class="region-revenue-table"
        :columns="[
          { key: 'name', label: 'Top Region' },
          { key: 'counting', label: 'Pengguna', align: 'right' },
        ]"
        :items="data"
      >
        <template #cell(counting)="{ rowData }"> {{ rowData[`counting_${selectedPeriod}`] }} user </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { downloadAsCSV } from '../../../../services/toCSV'
const selectedPeriod = ref('today')
const periods = ['Hari ini', 'Minggu ini', 'Bulan ini'].map((period) => {
  if (period == 'Hari ini') {
    return { label: period, value: 'today' }
  } else if (period == 'Minggu ini') {
    return { label: period, value: 'week' }
  } else {
    return { label: period, value: 'month' }
  }
})

const data = ref<[]>([])

// ;(async () => {
//   try {
//     const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboards/tlocation`, {
//       headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
//     })
//     if (res.data.data != null) {
//       data.value = res.data.data
//     }

//     console.log(res.data.data)
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       init({ message: error.response.data.message, color: 'danger' })
//     } else {
//       init({ message: 'unknown error', color: 'danger' })
//     }
//   }
// })()

// const data = [
//   {
//     name: 'Japan',
//     revenueToday: '4,748,454',
//     revenueWeek: '30,000,000',
//     revenueMonth: '120,000,000',
//   },
//   {
//     name: 'United Kingdom',
//     revenueToday: '405,748',
//     revenueWeek: '2,500,000',
//     revenueMonth: '10,000,000',
//   },
//   {
//     name: 'United States',
//     revenueToday: '308,536',
//     revenueWeek: '1,800,000',
//     revenueMonth: '8,000,000',
//   },
//   {
//     name: 'China',
//     revenueToday: '250,963',
//     revenueWeek: '1,600,000',
//     revenueMonth: '7,000,000',
//   },
//   {
//     name: 'Canada',
//     revenueToday: '29,415',
//     revenueWeek: '180,000',
//     revenueMonth: '800,000',
//   },
//   {
//     name: 'Australia',
//     revenueToday: '15,000',
//     revenueWeek: '100,000',
//     revenueMonth: '500,000',
//   },
//   {
//     name: 'India',
//     revenueToday: '10,000',
//     revenueWeek: '50,000',
//     revenueMonth: '200,000',
//   },
// ]

// const exportAsCSV = () => {
//   downloadAsCSV(data, 'region-revenue')
// }
</script>

<style lang="scss" scoped>
.region-revenue-table {
  ::v-deep(tbody) {
    tr {
      border-top: 1px solid var(--va-background-border);
    }
  }
}
</style>
