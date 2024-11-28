<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { HotspotProfile } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  hprofile: {
    type: Object as PropType<HotspotProfile | null>,
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

const defaultNewHotspotProfile: HotspotProfile = {
  username: '',
  groupname: '',
  priority: 8,
  Radgroupcheck: [],
  Radgroupreply: [],
}
const newHotspotProfile = ref<HotspotProfile>({ ...defaultNewHotspotProfile })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newHotspotProfile.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return (
      newHotspotProfile.value[key as keyof HotspotProfile] !==
      (props.hprofile ?? defaultNewHotspotProfile)?.[key as keyof HotspotProfile]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.hprofile,
  () => {
    if (!props.hprofile) {
      return
    }
    newHotspotProfile.value = {
      ...props.hprofile,
    }
  },
  { immediate: true },
)

const form = useForm('add-hprofile-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newHotspotProfile.value)
  }
}
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-hprofile-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newHotspotProfile.username"
          label="Nama Profil"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="username"
        />
        <VaInput
          v-model="newHotspotProfile.priority"
          label="Prioritas"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="priority"
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
