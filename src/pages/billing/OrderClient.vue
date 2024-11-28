<template>
  <VaCard class="mb-6">
    <VaCardContent>
      <h2 class="page-sub-title">Order client</h2>

      <div class="flex items-center justify-between md:justify-items-stretch">
        <div
          class="flex grow flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1 justify-between items-start md:items-center"
        >
          <div class="md:w-48">
            <p class="mb-1">pembuatan voucher berdasarkan pelanggan terdaftar</p>
          </div>
        </div>

        <div class="md:w-48 flex flex-col justify-end items-end">
          <VaButton preset="primary" @click="showCreate = true"> Order Klien </VaButton>
        </div>
      </div>
    </VaCardContent>
  </VaCard>
  <HotspotClientCreateModal v-if="showCreate" @close="showCreate = false" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import HotspotClientCreateModal from './modals/HotspotClientCreateModal.vue'

const showCreate = ref<boolean>(false)
</script>
