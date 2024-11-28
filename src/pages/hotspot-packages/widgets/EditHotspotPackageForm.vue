<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { HotspotPackage, ValidityUnit } from '../types'
import { HotspotProfile } from '../hotspot-profiles/types'
import { validators } from '../../../services/utils'
import { useHotspotProfiles } from '../../hotspot-profiles/composables/useHotspotProfiles'

const props = defineProps({
  hpackage: {
    type: Object as PropType<HotspotPackage | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewHotspotProfile: HotspotProfile = {
  username: '',
  groupname: '',
  priority: 8,
  Radgroupcheck: [],
  Radgroupreply: [],
}

const defaultNewHotspotPackage: HotspotPackage = {
  id: 0,
  name: '',
  validity_unit: 'HOUR',
  validity_value: '',
  price: '',
  margin: '',
  profile: '',
  selection_profile: defaultNewHotspotProfile,
  created_at: '',
  updated_at: '',
}
const newHotspotPackage = ref<HotspotPackage>({ ...defaultNewHotspotPackage })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newHotspotPackage.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return (
      newHotspotPackage.value[key as keyof HotspotPackage] !==
      (props.hpackage ?? defaultNewHotspotPackage)?.[key as keyof HotspotPackage]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.hpackage,
  () => {
    if (!props.hpackage) {
      return
    }
    newHotspotPackage.value = {
      ...props.hpackage,
    }
  },
  { immediate: true },
)

const form = useForm('add-hpackage-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newHotspotPackage.value)
  }
}

const validitiUnitSelectOptions: { text: Capitalize<ValidityUnit>; value: ValidityUnit }[] = [
  { text: 'Jam', value: 'HOUR' },
  { text: 'Hari', value: 'DAY' },
  { text: 'Bulan', value: 'MONTH' },
]

const { hprofiles } = useHotspotProfiles({ pagination: ref({ page: 1, perPage: 9999, total: 10 }) })
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-hpackage-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newHotspotPackage.name"
          label="Nama Paket"
          class="w-full"
          :rules="[validators.required]"
          name="name"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newHotspotPackage.validity_value"
          label="Durasi"
          mask="numeral"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="validity_value"
        />
        <VaSelect
          v-model="newHotspotPackage.validity_unit"
          label="Satuan Durasi"
          class="w-full sm:w-1/2"
          :options="validitiUnitSelectOptions"
          :rules="[validators.required]"
          name="validity_unit"
          value-by="value"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newHotspotPackage.price"
          label="Harga Pokok"
          mask="numeral"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="price"
        />
        <VaInput
          v-model="newHotspotPackage.margin"
          label="Keuntungan Reseller"
          class="w-full sm:w-1/2"
          mask="numeral"
          :rules="[validators.required]"
          name="margin"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect
          v-model="newHotspotPackage.selection_profile"
          label="Profil"
          class="w-full"
          :options="hprofiles"
          :rules="[validators.required]"
          name="selection_profile"
          text-by="username"
          track-by="username"
          :max-visible-options="2"
        />
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
