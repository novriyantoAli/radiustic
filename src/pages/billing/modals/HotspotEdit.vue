<template>
  <VaForm ref="form" @submit.prevent="submit">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <VaSelect
        v-model="orderLocal.package"
        :options="hpackages"
        :rules="[(v) => !!v || 'Payment System field is required']"
        class="mb-4"
        label="Paket"
        text-by="name"
        track-by="id"
        searchable
        highlight-matched-text
      />
      <VaSelect
        v-model="orderLocal.customer"
        :options="customers"
        :rules="[(v) => !!v || 'Payment System field is required']"
        class="mb-4"
        label="Pelanggan"
        text-by="name"
        track-by="id"
        searchable
        highlight-matched-text
      />
      <VaCheckbox v-model="orderLocal.order_hotspot.activated" class="mb-4" label="Telah aktiv" />
      <VaCheckbox v-model="orderLocal.order_hotspot.include_numbers" class="mb-4" label="Sertakan nomor" />
      <VaCheckbox v-model="orderLocal.order_hotspot.include_symbols" class="mb-4" label="Sertakan simbol" />
      <VaCheckbox
        v-model="orderLocal.order_hotspot.include_lowercase_letters"
        class="mb-4"
        label="Sertakan huruf kecil"
      />
      <VaCheckbox
        v-model="orderLocal.order_hotspot.include_uppercase_letters"
        class="mb-4"
        label="Sertakan huruf besar"
      />
      <VaCheckbox
        v-model="orderLocal.order_hotspot.exclude_ambiguous_characters"
        class="mb-4"
        label="Jangan sertakan karakter membingungkan"
      />
      <VaCheckbox
        v-model="orderLocal.order_hotspot.exclude_similar_characters"
        class="mb-4"
        label="Jangan sertakan karater yang hampir sama"
      />
      <VaInput
        v-model="orderLocal.amount"
        label="Jumlah"
        class="mb-4"
        :rules="[(v) => !!v || 'Payment System field is required']"
        name="amount"
      />
      <VaSelect
        v-model="orderLocal.payment"
        :options="paymentTypeOptions"
        :rules="[(v) => !!v || 'Payment System field is required']"
        class="mb-4"
        label="Pembayaran"
      />
    </div>
    <div class="flex justify-end gap-3">
      <VaButton color="secondary" preset="secondary" @click="emits('cancel')">Cancel</VaButton>
      <VaButton @click="submit">{{ submitText }}</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { useForm } from 'vuestic-ui'
import { Order, PaymentType } from '../types'
import { watch, ref } from 'vue'
import { useHotspotPackages } from '../../hotspot-packages/composables/useHotspotPackages'
import { useCustomers } from '../../customers/composables/useCustomers'

const { validate } = useForm('form')
const emits = defineEmits(['save', 'cancel'])

const props = defineProps<{
  order: Order
  submitText: string
}>()

const paymentTypeOptions = Object.values(PaymentType)
const orderLocal = ref({ ...props.order })

const { hpackages } = useHotspotPackages({ pagination: ref({ page: 1, perPage: 9999, total: 10 }) })
const { customers } = useCustomers({ pagination: ref({ page: 1, perPage: 9999, total: 10 }) })

watch(
  () => props.order,
  (order) => {
    orderLocal.value = { ...order }
  },
  { deep: true },
)

const submit = () => {
  if (validate()) {
    emits('save', { ...orderLocal.value })
  }
}
</script>
