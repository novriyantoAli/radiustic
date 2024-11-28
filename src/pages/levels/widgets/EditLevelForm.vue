<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Level } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  level: {
    type: Object as PropType<Level | null>,
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

const defaultNewLevel: Level = {
  id: -1,
  name: '',
}
const newLevel = ref<Level>({ ...defaultNewLevel })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newLevel.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newLevel.value[key as keyof Level] !== (props.level ?? defaultNewLevel)?.[key as keyof Level]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.level,
  () => {
    if (!props.level) {
      return
    }
    newLevel.value = {
      ...props.level,
    }
  },
  { immediate: true },
)

const form = useForm('add-level-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newLevel.value)
  }
}
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-level-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newLevel.name"
          label="Nama level"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
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
