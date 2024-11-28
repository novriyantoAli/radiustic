<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { HotspotPackage } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/hotspot-packages'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Validity Value', key: 'validity_value', sortable: true },
  { label: 'Validity Unit', key: 'validity_unit', sortable: true },
  { label: 'Price', key: 'price', sortable: true },
  { label: 'Margin', key: 'margin', sortable: true },
  { label: 'Profile', key: 'profile', sortable: true },
  { label: 'Created At', key: 'created_at', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  hpackages: {
    type: Array as PropType<HotspotPackage[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-hpackage', hpackage: HotspotPackage): void
  (event: 'delete-hpackage', hpackage: HotspotPackage): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const hpackages = toRef(props, 'hpackages')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()
const onHPackageDelete = async (hpackage: HotspotPackage) => {
  const agreed = await confirm({
    title: 'Delete Hotspot Package',
    message: `Are you sure you want to delete ${hpackage.name}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-hpackage', hpackage)
  }
}
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="hpackages"
    :loading="$props.loading"
  >
    <template #cell(name)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.name }}
      </div>
    </template>

    <template #cell(validity_unit)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.validity_unit }}
      </div>
    </template>

    <template #cell(validity_value)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.validity_value }}
      </div>
    </template>

    <template #cell(price)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.price }}
      </div>
    </template>

    <template #cell(margin)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.margin }}
      </div>
    </template>

    <template #cell(profile)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.profile }}
      </div>
    </template>

    <template #cell(created_at)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{
          new Date(rowData.created_at).toLocaleTimeString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit Hotspot Package"
          @click="$emit('edit-hpackage', rowData as HotspotPackage)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete Hotspot Package"
          @click="onHPackageDelete(rowData as HotspotPackage)"
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
