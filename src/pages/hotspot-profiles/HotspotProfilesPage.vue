<script setup lang="ts">
import { ref } from 'vue'
import HotspotProfilesTable from './widgets/HotspotProfilesTable.vue'
import EditHotspotProfileForm from './widgets/EditHotspotProfileForm.vue'
import { HotspotProfile } from './types'
import { useHotspotProfiles } from './composables/useHotspotProfiles'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'

const doShowEditHotspotProfileModal = ref(false)

const { hprofiles, isLoading, filters, sorting, pagination, ...hotspotProfilesApi } = useHotspotProfiles()

const hotspotProfileToEdit = ref<HotspotProfile | null>(null)
const showEditHospotProfileModal = (hprofile: HotspotProfile) => {
  hotspotProfileToEdit.value = hprofile
  doShowEditHotspotProfileModal.value = true
}

const showAddHotspotProfileModal = () => {
  hotspotProfileToEdit.value = null
  doShowEditHotspotProfileModal.value = true
}

const { init: notify } = useToast()

const onHotspotProfileSaved = async (hprofile: HotspotProfile) => {
  if (hotspotProfileToEdit.value) {
    try {
      await hotspotProfilesApi.update(hprofile)
      notify({ message: `${hprofile.username} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await hotspotProfilesApi.add(hprofile)
      notify({ message: `${hprofile.username} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onHotspotProfileDelete = async (hprofile: HotspotProfile) => {
  try {
    await hotspotProfilesApi.remove(hprofile)
    notify({ message: `${hprofile.username} has been deleted`, color: 'success' })
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
  <h1 class="page-title">Hotspot Profile</h1>

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
        <VaButton @click="showAddHotspotProfileModal">Tambah Hotspot Profil</VaButton>
      </div>

      <HotspotProfilesTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :hprofiles="hprofiles"
        :loading="isLoading"
        :pagination="pagination"
        @ed="showEditHospotProfileModal"
        @deleteHprofile="onHotspotProfileDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditHotspotProfileModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ hotspotProfileToEdit ? 'Ubah profil' : 'Tambah profil' }}</h1>
    <EditHotspotProfileForm
      ref="editFormRef"
      :hprofile="hotspotProfileToEdit"
      :save-button-label="hotspotProfileToEdit ? 'Simpan' : 'Tambah'"
      @close="cancel"
      @save="
        (hprofile) => {
          onHotspotProfileSaved(hprofile)
          ok()
        }
      "
    />
  </VaModal>
</template>
