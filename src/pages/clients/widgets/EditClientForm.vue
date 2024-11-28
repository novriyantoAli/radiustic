<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Client } from '../types'
import { ValidityUnit } from '../../hotspot-packages/types'
import { validators } from '../../../services/utils'
import { Customer } from '../../customers/types'
import { useCustomers } from '../../customers/composables/useCustomers'

const props = defineProps({
  client: {
    type: Object as PropType<Client | null>,
    default: null,
  },
  avatar: {
    type: File,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

// defineEmits<{
//   (event: 'save', level: Level): void
//   (event: 'close'): void
// }>()

const defaultNewCustomer: Customer = {
  id: -1,
  name: '',
  identity: '',
  sex: 'p',
  email: '',
  phone: '',
  job: '',
  image: '',
  birth_date: '',
  lat: '',
  lng: '',
  avatar: undefined,
}
const defaultNewClient: Client = {
  id: -1,
  id_customer: -1,
  username: '',
  password: '12345678',
  price: '',
  speed: '',
  session: '',
  notes: '',
  validity_value: '',
  validity_unit: 'MONTH',
  customer: defaultNewCustomer,
  created_at: '',
  updated_at: '',
}
const newClient = ref<Client>({ ...defaultNewClient })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newClient.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newClient.value[key as keyof Client] !== (props.client ?? defaultNewClient)?.[key as keyof Client]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.client,
  () => {
    if (!props.client) {
      return
    }
    newClient.value = { ...props.client }
  },
  { immediate: true },
)

const form = useForm('add-client-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newClient.value)
  }
}

const validitiUnitSelectOptions: { text: Capitalize<ValidityUnit>; value: ValidityUnit }[] = [
  { text: 'Jam', value: 'HOUR' },
  { text: 'Hari', value: 'DAY' },
  { text: 'Bulan', value: 'MONTH' },
]

const { customers } = useCustomers({ pagination: ref({ page: 1, perPage: 9999, total: 10 }) })
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-client-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect
          v-model="newClient.customer"
          label="Pelanggan"
          class="w-full sm:w-1/2"
          :options="customers"
          :rules="[validators.required]"
          name="customer"
          text-by="name"
          track-by="id"
          :max-visible-options="2"
        />
        <VaInput
          v-model="newClient.session"
          label="Sessi"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="session"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newClient.password"
          label="Password"
          class="w-full"
          :rules="[validators.required]"
          name="password"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newClient.speed"
          label="Kecepatan"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="speed"
        />
        <VaInput
          v-model="newClient.price"
          label="Harga"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="price"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newClient.validity_value"
          label="Durasi"
          mask="numeral"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="validity_value"
        />
        <VaSelect
          v-model="newClient.validity_unit"
          label="Satuan Durasi"
          class="w-full sm:w-1/2"
          :options="validitiUnitSelectOptions"
          :rules="[validators.required]"
          name="validity_unit"
          value-by="value"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newClient.notes" label="Catatan" class="w-full" :rules="[validators.required]" name="notes" />
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
