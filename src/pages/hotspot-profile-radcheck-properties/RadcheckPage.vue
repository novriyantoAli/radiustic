<script setup lang="ts">
import { ref } from 'vue'
import RadcheckTable from './widgets/RadcheckTable.vue'
import EditRadcheckForm from './widgets/EditRadcheckForm.vue'
import { Radcheck } from './types'
import { useRadchecks } from './composables/useRadcheck'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
// console.log(route.query.groupname)

const doShowEditRadcheckModal = ref(false)

const { radchecks, isLoading, filters, sorting, pagination, ...radcheckApi } = useRadchecks(
  route.query.groupname as string,
)

const radcheckToEdit = ref<Radcheck | null>(null)
const showEditRadcheckModal = (radcheck: Radcheck) => {
  radcheckToEdit.value = radcheck
  doShowEditRadcheckModal.value = true
}

const showAddRadcheckModal = () => {
  radcheckToEdit.value = null
  doShowEditRadcheckModal.value = true
}

const { init: notify } = useToast()

const onRadcheckSaved = async (radcheck: Radcheck) => {
  if (radcheckToEdit.value) {
    try {
      await radcheckApi.update(radcheck)
      notify({ message: `${radcheck.groupname} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await radcheckApi.add(radcheck)
      notify({ message: `${radcheck.groupname} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onRadcheckDelete = async (radcheck: Radcheck) => {
  try {
    await radcheckApi.remove(radcheck)
    notify({ message: `${radcheck.groupname} has been deleted`, color: 'success' })
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
  <h1 class="page-title">Radcheck Property</h1>
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
        <VaButton @click="showAddRadcheckModal">Tambah Radcheck Properti</VaButton>
      </div>

      <RadcheckTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :radchecks="radchecks"
        :loading="isLoading"
        :pagination="pagination"
        @editRadcheck="showEditRadcheckModal"
        @deleteRadcheck="onRadcheckDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditRadcheckModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ radcheckToEdit ? 'Ubah properti' : 'Tambah properti' }}</h1>
    <EditRadcheckForm
      ref="editFormRef"
      :radcheck="radcheckToEdit"
      :save-button-label="radcheckToEdit ? 'Simpan' : 'Tambah'"
      @close="cancel"
      @save="
        (radcheck) => {
          onRadcheckSaved(radcheck)
          ok()
        }
      "
    />
  </VaModal>
</template>
