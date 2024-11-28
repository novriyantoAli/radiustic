<template>
  <VaCard class="mb-6">
    <VaCardContent>
      <h2 class="page-sub-title">Order hotspot</h2>

      <div class="flex items-center justify-between md:justify-items-stretch">
        <div
          class="flex grow flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1 justify-between items-start md:items-center"
        >
          <div class="md:w-48">
            <p class="mb-1">pembuatan voucher berdasarkan paket yang telah ditetapkan</p>
          </div>
        </div>

        <div class="md:w-48 flex flex-col justify-end items-end">
          <VaButton preset="primary" @click="showCreate = true"> Order Hotspot </VaButton>
        </div>
      </div>
    </VaCardContent>
  </VaCard>
  <HotspotCreateModal v-if="showCreate" @close="showCreate = false" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import HotspotCreateModal from './modals/HotspotCreateModal.vue'

const showCreate = ref<boolean>(false)
</script>
