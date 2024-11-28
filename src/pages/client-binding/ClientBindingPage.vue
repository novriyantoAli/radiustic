<script setup lang="ts">
import { ref } from 'vue'
import ClientBindingsTable from './widgets/ClientBindingsTable.vue'
import EditClientBindingForm from './widgets/EditClientBindingForm.vue'
import { ClientBinding } from './types'
import { useClientBindings } from './composables/useClientBindings'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'

const doShowEditClientBindingModal = ref(false)

const { clientbindings, isLoading, filters, sorting, pagination, ...clientBindingsApi } = useClientBindings()

const clientBindingToEdit = ref<ClientBinding | null>(null)

const showEditClientBindingModal = (binding: ClientBinding) => {
  clientBindingToEdit.value = binding
  doShowEditClientBindingModal.value = true
}

const showAddClientBindingModal = () => {
  clientBindingToEdit.value = null
  doShowEditClientBindingModal.value = true
}

const { init: notify } = useToast()

const onClientBindingSaved = async (binding: ClientBinding) => {
  if (clientBindingToEdit.value) {
    try {
      await clientBindingsApi.update(binding)
      notify({ message: `${binding.mac} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await clientBindingsApi.add(binding)
      notify({ message: `${binding.mac} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onClientBindingDelete = async (binding: ClientBinding) => {
  try {
    await clientBindingsApi.remove(binding)
    notify({ message: `${binding.mac} has been deleted`, color: 'success' })
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
  <h1 class="page-title">Klien Binding</h1>

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
        <VaButton @click="showAddClientBindingModal">Tambah Klien Binding</VaButton>
      </div>

      <ClientBindingsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :clientbindings="clientbindings"
        :loading="isLoading"
        :pagination="pagination"
        @editClientbinding="showEditClientBindingModal"
        @deleteClientbinding="onClientBindingDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditClientBindingModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ clientBindingToEdit ? 'Ubah klien binding' : 'Tambah klien binding' }}</h1>
    <EditClientBindingForm
      ref="editFormRef"
      :clientbinding="clientBindingToEdit"
      :save-button-label="clientBindingToEdit ? 'Simpan' : 'Tambah'"
      @close="cancel"
      @save="
        (binding) => {
          onClientBindingSaved(binding)
          ok()
        }
      "
    />
  </VaModal>
</template>
