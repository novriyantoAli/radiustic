<template>
  <VaAvatar size="large" color="warning"><span class="text-4xl"> 😍 </span></VaAvatar>
  <div class="flex flex-col justify-center">
    <h2 class="text-[28px] md:text-[32px] leading-10 font-bold">{{ authStore.user.username }}</h2>
    <div class="flex space-x-1 text-[13px] leading-4">
      <p>Level</p>
      <p>{{ authStore.user.memberSince }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '../../../stores/auth-store'

const authStore = useAuthStore()
</script>
