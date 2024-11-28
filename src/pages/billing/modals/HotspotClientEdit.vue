<template>
  <VaForm ref="form" @submit.prevent="submit">
    <VaSelect
      v-model="orderLocal.order_client.client"
      :options="clients"
      :rules="[(v) => !!v || 'Payment System field is required']"
      class="mb-4"
      label="Klien"
      :text-by="(option) => option.customer.name + ' - ' + option.username"
      track-by="id"
    />

    <VaSelect
      v-model="orderLocal.payment"
      :options="paymentTypeOptions"
      :rules="[(v) => !!v || 'Payment System field is required']"
      class="mb-4"
      label="Pembayaran"
    />

    <VaInput
      v-model="orderLocal.amount"
      label="Jumlah Order"
      class="mb-4"
      :rules="[(v) => !!v || 'Payment System field is required']"
      name="amount"
    />

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
import { useClients } from '../../clients/composables/useClients'

const { validate } = useForm('form')
const emits = defineEmits(['save', 'cancel'])

const props = defineProps<{
  order: Order
  submitText: string
}>()

const paymentTypeOptions = Object.values(PaymentType)
const orderLocal = ref({ ...props.order })

const { clients } = useClients({ pagination: ref({ page: 1, perPage: 9999, total: 10 }) })

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
