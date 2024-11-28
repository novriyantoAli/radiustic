<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { HotspotProfile, Radcheck, Radreply } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/hotspot-profiles'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'username', sortable: true },
  { label: 'Priority', key: 'priority', sortable: true },
  { label: 'Property Radcheck', key: 'Radgroupcheck', sortable: true },
  { label: 'Property Radreply', key: 'Radgroupreply', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  hprofiles: {
    type: Array as PropType<HotspotProfile[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'delete-hprofile', hprofile: HotspotProfile): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const hprofiles = toRef(props, 'hprofiles')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()
const onHProfileDelete = async (hprofile: HotspotProfile) => {
  const agreed = await confirm({
    title: 'Delete Hotspot Profile',
    message: `Are you sure you want to delete ${hprofile.username}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-hprofile', hprofile)
  }
}
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="hprofiles"
    :loading="$props.loading"
  >
    <template #cell(username)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.username }}
      </div>
    </template>

    <template #cell(priority)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.priority }}
      </div>
    </template>

    <template #cell(Radgroupcheck)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ ((rowData as HotspotProfile).Radgroupcheck as Radcheck[]).length }}
      </div>
    </template>

    <template #cell(Radgroupreply)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ ((rowData as HotspotProfile).Radgroupreply as Radreply[]).length }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-checklist"
          color="primary"
          aria-label="Goto Radcheck Profile"
          :href="'/hotspot-profiles/hotspot-profile-radcheck?groupname=' + rowData.groupname"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-reply"
          color="primary"
          aria-label="Goto Radreply Profile"
          :href="'/hotspot-profiles/hotspot-profile-radreply?groupname=' + rowData.groupname"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete Hotspot Profile"
          @click="onHProfileDelete(rowData as HotspotProfile)"
        />
      </div>
    </template>
  </VaDataTable>

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
