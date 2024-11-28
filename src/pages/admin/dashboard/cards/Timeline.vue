<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../../../stores/auth-store'
import axios from 'axios'
import { useToast } from 'vuestic-ui/web-components'

interface Timeline {
  id: number
  information: string
  created: string
}

const { init } = useToast()
const timelines = ref<Timeline[]>([])

;(async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboards/timeline`, {
      headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
    })
    timelines.value = res.data.data as Timeline[]
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      init({ message: error.response.data.message, color: 'danger' })
    } else {
      init({ message: 'unknown error', color: 'danger' })
    }
  }
})()
</script>

<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Linimasa</h1>
    </VaCardTitle>
    <VaCardContent>
      <table class="mt-4">
        <tbody></tbody>
      </table>
    </VaCardContent>
  </VaCard>
</template>
