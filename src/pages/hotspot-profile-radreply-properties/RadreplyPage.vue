<script setup lang="ts">
import { ref } from 'vue'
import RadreplyTable from './widgets/RadreplyTable.vue'
import EditRadreplyForm from './widgets/EditRadreplyForm.vue'
import { Radreply } from './types'
import { useRadreplys } from './composables/useRadreply' // './composables/useRadreply'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()

const doShowEditRadreplyModal = ref(false)

const { radreplys, isLoading, filters, sorting, pagination, ...radreplyApi } = useRadreplys(
  route.query.groupname as string,
)

const radreplyToEdit = ref<Radreply | null>(null)
const showEditRadreplyModal = (radreply: Radreply) => {
  radreplyToEdit.value = radreply
  doShowEditRadreplyModal.value = true
}

const showAddRadreplyModal = () => {
  radreplyToEdit.value = null
  doShowEditRadreplyModal.value = true
}

const { init: notify } = useToast()

const onRadreplySaved = async (radreply: Radreply) => {
  if (radreplyToEdit.value) {
    try {
      await radreplyApi.update(radreply)
      notify({ message: `${radreply.groupname} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await radreplyApi.add(radreply)
      notify({ message: `${radreply.groupname} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onRadreplyDelete = async (radreply: Radreply) => {
  try {
    await radreplyApi.remove(radreply)
    notify({ message: `${radreply.groupname} has been deleted`, color: 'success' })
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
  <h1 class="page-title">Radreply Property</h1>
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
        <VaButton @click="showAddRadreplyModal">Tambah Radreply Properti</VaButton>
      </div>

      <RadreplyTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :radreplys="radreplys"
        :loading="isLoading"
        :pagination="pagination"
        @editRadreply="showEditRadreplyModal"
        @deleteRadreply="onRadreplyDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditRadreplyModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ radreplyToEdit ? 'Ubah properti' : 'Tambah properti' }}</h1>
    <EditRadreplyForm
      ref="editFormRef"
      :radreply="radreplyToEdit"
      :save-button-label="radreplyToEdit ? 'Simpan' : 'Tambah'"
      @close="cancel"
      @save="
        (radreply) => {
          onRadreplySaved(radreply)
          ok()
        }
      "
    />
  </VaModal>
</template>
