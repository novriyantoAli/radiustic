<script setup lang="ts">
import { ref } from 'vue'
import LevelsTable from './widgets/LevelsTable.vue'
import EditLevelForm from './widgets/EditLevelForm.vue'
import { Level } from './types'
import { useLevels } from './composables/useLevels'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'

const doShowEditLevelModal = ref(false)

const { levels, isLoading, filters, sorting, pagination, ...levelsApi } = useLevels()

const levelToEdit = ref<Level | null>(null)

// const showEditUserModal = (user: User) => {
const showEditLevelModal = (level: Level) => {
  levelToEdit.value = level
  doShowEditLevelModal.value = true
}

const showAddLevelModal = () => {
  levelToEdit.value = null
  doShowEditLevelModal.value = true
}

const { init: notify } = useToast()

const onLevelSaved = async (level: Level) => {
  if (levelToEdit.value) {
    try {
      await levelsApi.update(level)
      notify({ message: `${level.name} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await levelsApi.add(level)
      notify({ message: `${level.name} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onLevelDelete = async (level: Level) => {
  try {
    await levelsApi.remove(level)
    notify({ message: `${level.name} has been deleted`, color: 'success' })
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
  <h1 class="page-title">Level</h1>

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
        <VaButton @click="showAddLevelModal">Tambah Level</VaButton>
      </div>

      <LevelsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :levels="levels"
        :loading="isLoading"
        :pagination="pagination"
        @editLevel="showEditLevelModal"
        @deleteLevel="onLevelDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditLevelModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ levelToEdit ? 'Ubah level' : 'Tambah level' }}</h1>
    <EditLevelForm
      ref="editFormRef"
      :level="levelToEdit"
      :save-button-label="levelToEdit ? 'Simpan' : 'Tambah'"
      @close="cancel"
      @save="
        (level) => {
          onLevelSaved(level)
          ok()
        }
      "
    />
  </VaModal>
</template>
