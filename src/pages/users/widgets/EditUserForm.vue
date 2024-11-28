<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Usr } from '../types'
import { Level } from '../../levels/types'
import { validators } from '../../../services/utils'
import { useLevels } from '../../levels/composables/useLevels'

const props = defineProps({
  user: {
    type: Object as PropType<Usr | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultLevel: Level = {
  id: -1,
  name: '',
}

const defaultNewUser: Usr = {
  id: -1,
  id_level: -1,
  name: '',
  email: '',
  password: '',
  usr_level: defaultLevel,
  created: '',
}
// const defaultNewUser: User = {
//   id: -1,
//   avatar: '',
//   fullname: '',
//   role: 'user',
//   username: '',
//   notes: '',
//   email: '',
//   active: true,
//   projects: [],
// }

// const newUser = ref<User>({ ...defaultNewUser })
const newUser = ref<Usr>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newUser.value[key as keyof Usr] !== (props.user ?? defaultNewUser)?.[key as keyof Usr]

    // return newUser.value[key as keyof User] !== (props.user ?? defaultNewUser)?.[key as keyof User]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.user,
  () => {
    if (!props.user) {
      return
    }

    newUser.value = { ...props.user }
  },
  { immediate: true },
)

const avatar = ref<File>()

watch(avatar, (newAvatar) => {
  console.log(newAvatar)

  // newUser.value.avatar = newAvatar ? makeAvatarBlobUrl(newAvatar) : ''
})

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newUser.value)
  }
}

// const roleSelectOptions: { text: Capitalize<UserRole>; value: UserRole }[] = [
//   { text: 'Admin', value: 'admin' },
//   { text: 'User', value: 'user' },
//   { text: 'Owner', value: 'owner' },
// ]

const { levels } = useLevels({ pagination: ref({ page: 1, perPage: 9999, total: 10 }) })
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <VaFileUpload
      v-model="avatar"
      type="single"
      hide-file-list
      class="self-stretch justify-start items-center gap-4 inline-flex"
    >
      <!-- <UserAvatar :user="newUser" size="large" /> -->
      <VaButton preset="primary" size="small">Add image</VaButton>
      <VaButton
        v-if="avatar"
        preset="primary"
        color="danger"
        size="small"
        icon="delete"
        class="z-10"
        @click.stop="avatar = undefined"
      />
    </VaFileUpload>
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaSelect
          v-model="newUser.usr_level"
          label="Level"
          class="w-full sm:w-1/2"
          :options="levels"
          :rules="[validators.required]"
          name="usr_level"
          text-by="name"
          track-by="id"
          :max-visible-options="2"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.email"
          label="Email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
        />
        <VaInput
          v-if="newUser.id == -1"
          v-model="newUser.password"
          label="Password"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="password"
        />
        <!-- <VaSelect
          v-model="newUser.projects"
          label="Projects"
          class="w-full sm:w-1/2"
          :options="projects"
          :rules="[validators.required]"
          name="projects"
          text-by="project_name"
          track-by="id"
          multiple
          :max-visible-options="2"
        /> -->
      </div>

      <div class="flex gap-4 w-full">
        <div class="w-1/2">
          <!-- <VaSelect
            v-model="newUser.role"
            label="Role"
            class="w-full"
            :options="roleSelectOptions"
            :rules="[validators.required]"
            name="role"
            value-by="value"
          /> -->
        </div>

        <div class="flex items-center w-1/2 mt-4">
          <!-- <VaCheckbox v-model="newUser.active" label="Active" class="w-full" name="active" /> -->
        </div>
      </div>

      <!-- <VaTextarea v-model="newUser.notes" label="Notes" class="w-full" name="notes" /> -->
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
