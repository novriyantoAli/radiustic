<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Radcheck } from '../types'
import { validators } from '../../../services/utils'
import { useHotspotProfiles } from '../../hotspot-profiles/composables/useHotspotProfiles'
import { useRoute } from 'vue-router'
import { HotspotProfile } from '../../hotspot-profiles/types'

const props = defineProps({
  radcheck: {
    type: Object as PropType<Radcheck | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const route = useRoute()

const defaultProfile: HotspotProfile = {
  username: '',
  groupname: '',
  priority: 8,
  Radgroupcheck: [],
  Radgroupreply: [],
}

if (route.query.groupname !== undefined) {
  defaultProfile.groupname = route.query.groupname as string
}

const defaultNewRadcheck: Radcheck = {
  id: -1,
  groupname: '',
  profile: defaultProfile,
  attribute: '',
  op: '',
  value: '',
}

const newRadcheck = ref<Radcheck>({ ...defaultNewRadcheck })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newRadcheck.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newRadcheck.value[key as keyof Radcheck] !== (props.radcheck ?? defaultNewRadcheck)?.[key as keyof Radcheck]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.radcheck,
  () => {
    if (!props.radcheck) {
      return
    }
    newRadcheck.value = {
      ...props.radcheck,
    }
  },
  { immediate: true },
)

const form = useForm('add-radcheck-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newRadcheck.value)
  }
}

const { hprofiles } = useHotspotProfiles({ pagination: ref({ page: 1, perPage: 9999, total: 10 }) })
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-radcheck-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 w-full">
        <VaSelect
          v-if="route.query.groupname === undefined"
          v-model="newRadcheck.profile"
          label="Groupname"
          class="w-full"
          :options="hprofiles"
          :rules="[validators.required]"
          name="profile"
          text-by="username"
          track-by="username"
          :max-visible-options="2"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newRadcheck.attribute"
          label="Attribute"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="attribute"
        />
        <VaInput v-model="newRadcheck.op" label="OP" class="w-full sm:w-1/2" :rules="[validators.required]" name="op" />
      </div>
      <div class="flex gap-4 w-full">
        <VaInput v-model="newRadcheck.value" label="Value" class="w-full" :rules="[validators.required]" name="value" />
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
