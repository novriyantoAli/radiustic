<script setup lang="ts">
import { PropType } from 'vue'
import { Customer } from '../types'

const avatarColor = (userName: string) => {
  const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
  const index = userName.charCodeAt(0) % colors.length
  return colors[index]
}

defineProps({
  customer: {
    type: Object as PropType<Customer>,
    required: true,
  },
  size: {
    type: String,
    default: 'medium',
  },
})

const buildURL = (avatar: string) => {
  return import.meta.env.VITE_APP_PUBLIC + avatar
}
</script>

<template>
  <VaAvatar
    :size="size"
    :src="buildURL(customer.image)"
    :fallback-text="customer.image || customer.identity"
    :color="avatarColor(customer.name)"
  />
</template>
