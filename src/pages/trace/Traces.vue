<template>
  <h1 class="page-title">Lacak</h1>
  <div class="flex flex-col p-4 space-y-10 bg-backgroundSecondary rounded-lg">
    <div class="flex space-x-5">
      <VaInput v-model="username" class="mb-6" label="Kata kunci" placeholder="Masukkan username">
        <template #prepend>
          <VaIcon name="person_search" class="mr-2" color="secondary" />
        </template>
      </VaInput>
      <VaButton size="medium" class="mr-6 mb-2" @click="traceUsername(username)"> Cari </VaButton>
    </div>
  </div>

  <VaStepper v-model="step" :steps="steps" vertical controls-hidden>
    <template #step-content-0>
      <ul>
        <li>Select a category</li>
        <li>Browse products</li>
        <li>Add to cart</li>
      </ul>
    </template>
    <template #step-content-1>
      <ul>
        <li>Fill out shipping information</li>
        <li>Choose payment method</li>
      </ul>
    </template>
    <template #step-content-2>
      <ul>
        <li>View order summary</li>
        <li>Edit shipping information</li>
      </ul>
    </template>
    <template #step-content-3>
      <ul>
        <li>Review order details</li>
        <li>Complete payment</li>
      </ul>
    </template>
  </VaStepper>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth-store'
import axios from 'axios'
import { useToast } from 'vuestic-ui/web-components'

const { init } = useToast()

const step = ref(0)

const username = ref('')

const steps = [
  { label: 'Dibuat', icon: 'add' },
  { label: 'Diaktifkan', icon: 'more_time' },
  { label: 'Kadarluwarsa', icon: 'update_disabled' },
]

const traceUsername = async (username: string) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/trace?param=${username}`, {
      headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
    })

    console.log(res.data.data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      init({ message: error.response.data.message, color: 'danger' })
    } else {
      init({ message: 'unknown error', color: 'danger' })
    }
  }
}
</script>
