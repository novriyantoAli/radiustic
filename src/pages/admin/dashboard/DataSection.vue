<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <DataSectionItem
      v-for="metric in dashboardMetricss"
      :key="metric.id"
      :title="metric.title"
      :value="metric.value"
      :change-text="metric.changeText"
      :up="metric.changeDirection === 'up'"
      :icon-background="metric.iconBackground"
      :icon-color="metric.iconColor"
    >
      <template #icon>
        <VaIcon :name="metric.icon" size="large" />
      </template>
    </DataSectionItem>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useColors } from 'vuestic-ui'
import { useAuthStore } from '../../../stores/auth-store'
import { useToast } from 'vuestic-ui'
import DataSectionItem from './DataSectionItem.vue'
import axios from 'axios'

interface DashboardMetric {
  id: string
  title: string
  value: string
  icon: string
  changeText: string
  changeDirection: 'up' | 'down'
  iconBackground: string
  iconColor: string
}

const { init } = useToast()

const { getColor } = useColors()

const dashboardMetricss = ref<DashboardMetric[]>([])

;(async () => {
  // mengambil data dari sever
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboards`, {
      headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
    })
    const dashboardM = res.data.data as DashboardMetric[]
    dashboardMetricss.value = dashboardM.map((matrix) => {
      matrix.iconBackground = getColor('success')
      matrix.iconColor = getColor('on-success')
      return matrix
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      init({ message: error.response.data.message, color: 'danger' })
    } else {
      init({ message: 'unknown error', color: 'danger' })
    }
  }
})()

// const dashboardMetrics = computed<DashboardMetric[]>(() => [
//   {
//     id: 'openInvoices',
//     title: 'Konsumen',
//     value: '8',
//     icon: 'mso-attach_money',
//     changeText: '$1, 450',
//     changeDirection: 'down',
//     iconBackground: getColor('success'),
//     iconColor: getColor('on-success'),
//   },
//   {
//     id: 'ongoingProjects',
//     title: 'Klien',
//     value: '15',
//     icon: 'mso-folder_open',
//     changeText: '25.36%',
//     changeDirection: 'up',
//     iconBackground: getColor('info'),
//     iconColor: getColor('on-info'),
//   },
//   {
//     id: 'employees',
//     title: 'Employees',
//     value: '25',
//     icon: 'mso-account_circle',
//     changeText: '2.5%',
//     changeDirection: 'up',
//     iconBackground: getColor('danger'),
//     iconColor: getColor('on-danger'),
//   },
//   {
//     id: 'newProfit',
//     title: 'Paket Hotspot',
//     value: '2',
//     icon: 'mso-grade',
//     changeText: '4%',
//     changeDirection: 'up',
//     iconBackground: getColor('warning'),
//     iconColor: getColor('on-warning'),
//   },
// ]);
</script>
