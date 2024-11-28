<script setup lang="ts">
import { ref } from 'vue'
import CustomersTable from './widgets/CustomersTable.vue'
import EditCustomerForm from './widgets/EditCustomerForm.vue'
import { Customer } from './types'
import { useCustomers } from './composables/useCustomers'
import { useModal, useToast } from 'vuestic-ui'
import axios from 'axios'

const doShowEditCustomerModal = ref(false)

const { customers, isLoading, filters, sorting, pagination, ...customersApi } = useCustomers()

const customerToEdit = ref<Customer | null>(null)

// const showEditUserModal = (user: User) => {
const showEditCustomerModal = (customer: Customer) => {
  customerToEdit.value = customer
  doShowEditCustomerModal.value = true
}

const showAddCustomerModal = () => {
  customerToEdit.value = null
  doShowEditCustomerModal.value = true
}

const { init: notify } = useToast()

const onCustomerSaved = async (customer: Customer, avatar: File) => {
  console.log(avatar)

  if (customerToEdit.value) {
    try {
      await customersApi.update(customer)
      notify({ message: `${customer.name} has been updated`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  } else {
    try {
      await customersApi.add(customer)
      notify({ message: `${customer.name} has been created`, color: 'success' })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        notify({ message: err.response.data.message, color: 'danger' })
      }
    }
  }
}

const onCustomerDelete = async (customer: Customer) => {
  try {
    await customersApi.remove(customer)
    notify({ message: `${customer.name} has been deleted`, color: 'success' })
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
  <h1 class="page-title">Customer</h1>

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
        <VaButton @click="showAddCustomerModal">Add Customer</VaButton>
      </div>

      <CustomersTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :customers="customers"
        :loading="isLoading"
        :pagination="pagination"
        @editCustomer="showEditCustomerModal"
        @deleteCustomer="onCustomerDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditCustomerModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ customerToEdit ? 'Edit customer' : 'Add customer' }}</h1>
    <EditCustomerForm
      ref="editFormRef"
      :customer="customerToEdit"
      :save-button-label="customerToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (customer, avatar) => {
          onCustomerSaved(customer, avatar)
          ok()
        }
      "
    />
  </VaModal>
</template>
