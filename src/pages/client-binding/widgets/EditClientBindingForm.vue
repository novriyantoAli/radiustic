<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { ClientBinding } from '../types'
import { validators } from '../../../services/utils'
import { useClients } from '../../clients/composables/useClients'

const props = defineProps({
  clientbinding: {
    type: Object as PropType<ClientBinding | null>,
    default: null,
  },
  avatar: {
    type: File,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Simpan',
  },
})

const defaultNewClientBinding: ClientBinding = {
  id: -1,
  id_client: -1,
  mac: '',
  client: undefined,
}
const newClientBinding = ref<ClientBinding>({ ...defaultNewClientBinding })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newClientBinding.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return (
      newClientBinding.value[key as keyof ClientBinding] !==
      (props.clientbinding ?? defaultNewClientBinding)?.[key as keyof ClientBinding]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.clientbinding,
  () => {
    if (!props.clientbinding) {
      return
    }
    newClientBinding.value = { ...props.clientbinding }
  },
  { immediate: true },
)

const form = useForm('add-clientbinding-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newClientBinding.value)
  }
}

const { clients } = useClients({ pagination: ref({ page: 1, perPage: 9999, total: 10 }) })
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-clientbinding-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect
          v-model="newClientBinding.client"
          label="Klien"
          class="w-full sm:w-1/2"
          :options="clients"
          :rules="[validators.required]"
          name="client"
          text-by="username"
          track-by="id"
          :max-visible-options="2"
        />
        <VaInput
          v-model="newClientBinding.mac"
          label="Alamat Mac"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="mac"
        />
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
