<script setup lang="ts">
import { ref } from 'vue'
import ClientsTable from './widgets/ClientsTable.vue'
import EditClientForm from './widgets/EditClientForm.vue'
import { Client } from './types'
import { useClients } from './composables/useClients'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'

const doShowEditClientModal = ref(false)

const { clients, isLoading, filters, sorting, pagination, ...clientsApi } = useClients()

const clientToEdit = ref<Client | null>(null)

const showEditClientModal = (client: Client) => {
  clientToEdit.value = client
  doShowEditClientModal.value = true
}

const showAddClientModal = () => {
  clientToEdit.value = null
  doShowEditClientModal.value = true
}

const { init: notify } = useToast()

const onClientSaved = async (client: Client) => {
  if (clientToEdit.value) {
    try {
      await clientsApi.update(client)
      notify({ message: `${client.username} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await clientsApi.add(client)
      notify({ message: `${client.username} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onClientDelete = async (client: Client) => {
  try {
    await clientsApi.remove(client)
    notify({ message: `${client.username} has been deleted`, color: 'success' })
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
  <h1 class="page-title">Client</h1>

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
        <VaButton @click="showAddClientModal">Add Client</VaButton>
      </div>

      <ClientsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :clients="clients"
        :loading="isLoading"
        :pagination="pagination"
        @editClient="showEditClientModal"
        @deleteClient="onClientDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditClientModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ clientToEdit ? 'Edit client' : 'Add client' }}</h1>
    <EditClientForm
      ref="editFormRef"
      :client="clientToEdit"
      :save-button-label="clientToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (client) => {
          onClientSaved(client)
          ok()
        }
      "
    />
  </VaModal>
</template>
