<script setup lang="ts">
import { ref } from 'vue'
import NassTable from './widgets/NassTable.vue'
import EditNasForm from './widgets/EditNasForm.vue'
import { Nas } from './types'
import { useNass } from './composables/useNass'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'

const doShowEditNasModal = ref(false)

const { nass, isLoading, filters, sorting, pagination, ...nassApi } = useNass()

const nasToEdit = ref<Nas | null>(null)

// const showEditUserModal = (user: User) => {
const showEditNasModal = (nas: Nas) => {
  nasToEdit.value = nas
  doShowEditNasModal.value = true
}

const showAddNasModal = () => {
  nasToEdit.value = null
  doShowEditNasModal.value = true
}

const { init: notify } = useToast()

const onNasSaved = async (nas: Nas) => {
  if (nasToEdit.value) {
    try {
      await nassApi.update(nas)
      notify({ message: `${nas.shortname} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await nassApi.add(nas)
      notify({ message: `${nas.shortname} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onNasDelete = async (nas: Nas) => {
  try {
    await nassApi.remove(nas)
    notify({ message: `${nas.shortname} has been deleted`, color: 'success' })
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
  <h1 class="page-title">Nas</h1>

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
        <VaButton @click="showAddNasModal">Tambah Nas</VaButton>
      </div>

      <NassTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :nass="nass"
        :loading="isLoading"
        :pagination="pagination"
        @editNas="showEditNasModal"
        @deleteNas="onNasDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditNasModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ nasToEdit ? 'Ubah nas' : 'Tambahkan nas' }}</h1>
    <EditNasForm
      ref="editFormRef"
      :nas="nasToEdit"
      :save-button-label="nasToEdit ? 'Simpan' : 'Tambah'"
      @close="cancel"
      @save="
        (nas) => {
          onNasSaved(nas)
          ok()
        }
      "
    />
  </VaModal>
</template>
