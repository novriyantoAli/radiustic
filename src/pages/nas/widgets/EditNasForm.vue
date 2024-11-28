<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Nas } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  nas: {
    type: Object as PropType<Nas | null>,
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

const defaultNewNas: Nas = {
  id: -1,
  nasname: '',
  shortname: '',
  type: 'other',
  ports: '',
  secret: '',
  server: '',
  community: '',
  description: '',
}
const newNas = ref<Nas>({ ...defaultNewNas })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newNas.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newNas.value[key as keyof Nas] !== (props.nas ?? defaultNewNas)?.[key as keyof Nas]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.nas,
  () => {
    if (!props.nas) {
      return
    }
    newNas.value = {
      ...props.nas,
    }
  },
  { immediate: true },
)

const form = useForm('add-nas-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newNas.value)
  }
}
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-nas-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newNas.nasname"
          label="IP / Hostname NAS"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="nasname"
        />
        <VaInput
          v-model="newNas.shortname"
          label="Panggilan NAS"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="shortname"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newNas.type"
          label="Tipe"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="type"
        />
        <VaInput
          v-model="newNas.ports"
          label="Port"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="ports"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newNas.secret"
          label="Secret"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="secret"
        />
        <VaInput
          v-model="newNas.server"
          label="Server"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="server"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newNas.community"
          label="Komunitas"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="community"
        />
        <VaInput
          v-model="newNas.description"
          label="Deskripsi"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="description"
        />
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
