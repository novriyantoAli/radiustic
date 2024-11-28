<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Customer, CustomerSex } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  customer: {
    type: Object as PropType<Customer | null>,
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
const newCustomer = ref<Customer>({ ...defaultNewCustomer })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newCustomer.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newCustomer.value[key as keyof Customer] !== (props.customer ?? defaultNewCustomer)?.[key as keyof Customer]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.customer,
  () => {
    if (!props.customer) {
      return
    }
    newCustomer.value = {
      ...props.customer,
      image: props.customer.image || '',
      avatar: props.customer.avatar || undefined,
    }
  },
  { immediate: true },
)

const avtr = ref<File>()

const makeAvatarBlobUrl = (avr: File) => {
  return URL.createObjectURL(avr)
}

watch(avtr, (newAvatar) => {
  newCustomer.value.image = newAvatar ? makeAvatarBlobUrl(newAvatar) : ''
  newCustomer.value.avatar = newAvatar
})

const form = useForm('add-customer-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newCustomer.value)
  }
}

const sexSelectOptions: { text: Capitalize<CustomerSex>; value: CustomerSex }[] = [
  { text: 'P', value: 'p' },
  { text: 'W', value: 'w' },
]
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-customer-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <VaFileUpload
      v-model="avtr"
      type="single"
      hide-file-list
      class="self-stretch justify-start items-center gap-4 inline-flex"
    >
      <CustomerAvatar :user="newCustomer" size="large" />
      <VaButton preset="primary" size="small">Add image</VaButton>
      <VaButton
        v-if="avatar"
        preset="primary"
        color="danger"
        size="small"
        icon="delete"
        class="z-10"
        @click.stop="avtr = undefined"
      />
    </VaFileUpload>
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newCustomer.identity"
          label="No Identitas"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="identity"
        />
        <VaInput
          v-model="newCustomer.name"
          label="Nama"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect
          v-model="newCustomer.sex"
          label="Jenis Kelamin"
          class="w-full sm:w-1/2"
          :options="sexSelectOptions"
          :rules="[validators.required]"
          name="sex"
          value-by="value"
        />
        <VaInput
          v-model="newCustomer.job"
          label="Pekerjaan"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="job"
        />
      </div>
      <div class="flex gap-4 w-full">
        <VaDateInput
          v-model="newCustomer.birth_date"
          :rules="[validators.required]"
          label="Tanggal Lahir"
          class="w-full"
          name="birth_date"
          manual-input
          clearable
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newCustomer.phone"
          label="No. HP"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="phone"
        />
        <VaInput
          v-model="newCustomer.email"
          label="Email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newCustomer.lat"
          label="Latitude"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="lat"
        />
        <VaInput
          v-model="newCustomer.lng"
          label="Longitude"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="lng"
        />
      </div>
      <div class="flex gap-4 w-full">
        <div class="w-1/2"></div>

        <div class="flex items-center w-1/2 mt-4"></div>
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
