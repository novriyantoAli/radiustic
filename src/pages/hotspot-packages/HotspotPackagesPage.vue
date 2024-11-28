<script setup lang="ts">
import { ref } from 'vue'
import HotspotPackageTable from './widgets/HotspotPackageTable.vue'
import EditHotspotPackageForm from './widgets/EditHotspotPackageForm.vue'
import { HotspotPackage } from './types'
import { useHotspotPackages } from './composables/useHotspotPackages'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'

const doShowEditHotspotPackageModal = ref(false)

const { hpackages, isLoading, filters, sorting, pagination, ...hotspotPackagesApi } = useHotspotPackages()

const hotspotPackageToEdit = ref<HotspotPackage | null>(null)
const showEditHospotPackageModal = (hpackage: HotspotPackage) => {
  hotspotPackageToEdit.value = hpackage
  doShowEditHotspotPackageModal.value = true
}

const showAddHotspotPackageModal = () => {
  hotspotPackageToEdit.value = null
  doShowEditHotspotPackageModal.value = true
}

const { init: notify } = useToast()

const onHotspotPackageSaved = async (hpackage: HotspotPackage) => {
  if (hotspotPackageToEdit.value) {
    try {
      await hotspotPackagesApi.update(hpackage)
      notify({ message: `${hpackage.name} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await hotspotPackagesApi.add(hpackage)
      notify({ message: `${hpackage.name} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onHotspotPackageDelete = async (hpackage: HotspotPackage) => {
  try {
    await hotspotPackagesApi.remove(hpackage)
    notify({ message: `${hpackage.name} has been deleted`, color: 'success' })
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      notify({ message: err.response.data.message, color: 'danger' })
    }
  }
}

const editFormRef = ref()

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}
</script>

<template>
  <h1 class="page-title">Hotspot Package</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddHotspotPackageModal">Tambah Hotspot Paket</VaButton>
      </div>

      <HotspotPackageTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :hpackages="hpackages"
        :loading="isLoading"
        :pagination="pagination"
        @editHpackage="showEditHospotPackageModal"
        @deleteHpackage="onHotspotPackageDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditHotspotPackageModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ hotspotPackageToEdit ? 'Ubah paket' : 'Tambah paket' }}</h1>
    <EditHotspotPackageForm
      ref="editFormRef"
      :hpackage="hotspotPackageToEdit"
      :save-button-label="hotspotPackageToEdit ? 'Simpan' : 'Tambah'"
      @close="cancel"
      @save="
        (hpackage) => {
          onHotspotPackageSaved(hpackage)
          ok()
        }
      "
    />
  </VaModal>
</template>
