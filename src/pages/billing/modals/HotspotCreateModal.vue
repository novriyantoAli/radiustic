<template>
  <VaModal hide-default-actions model-value size="small" close-button @cancel="emits('close')">
    <h3 class="va-h4 mb-4">Buat orderan hotspot</h3>
    <HotspotEdit :order="order" submit-text="Buat Orderan" @cancel="emits('close')" @save="updateCard" />
  </VaModal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import HotspotEdit from './HotspotEdit.vue'
import { PaymentType, Order, OrderClient, OrderHotspot } from '../types'
import { useToast } from 'vuestic-ui'
import { Client } from '../../clients/types'
import { Customer } from '../../customers/types'
import { Usr } from '../../users/types'
import { Level } from '../../levels/types'
import { HotspotPackage } from '../../hotspot-packages/types'
import { HotspotProfile } from '../../hotspot-profiles/types'
import axios from 'axios'
import { useAuthStore } from '../../../stores/auth-store'

const isModalOpen = ref(false)

const emits = defineEmits(['close'])
const { init } = useToast()

const newHotspotProfile: HotspotProfile = {
  username: '',
  groupname: '',
  priority: 8,
  Radgroupcheck: [],
  Radgroupreply: [],
}

const newPackage: HotspotPackage = {
  id: -1,
  name: '',
  validity_value: '',
  validity_unit: 'MONTH',
  price: '',
  margin: '',
  profile: '',
  selection_profile: newHotspotProfile,
  created_at: '',
  updated_at: '',
}

const newCustomer: Customer = {
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
}

const newClient: Client = {
  id: -1,
  id_customer: -1,
  username: '',
  password: '',
  price: '',
  speed: '',
  session: '',
  validity_value: '',
  validity_unit: 'MONTH',
  notes: '',
  customer: newCustomer,
  created_at: '',
  updated_at: '',
}

const newOrderClient: OrderClient = {
  id_batch: '',
  id_client: -1,
  client: newClient,
  expire: '',
}

const newOrderHotspot: OrderHotspot = {
  id_batch: '',
  include_symbols: false,
  include_numbers: true,
  include_lowercase_letters: true,
  include_uppercase_letters: false,
  exclude_similar_characters: true,
  exclude_ambiguous_characters: true,
  activated: false,
  id_package: -1,
}

const newLevel: Level = {
  id: -1,
  name: '',
}

const newUser: Usr = {
  id: -1,
  id_level: -1,
  name: '',
  email: '',
  password: '',
  usr_level: newLevel,
  created: '',
}

const order = reactive({
  id: -1,
  id_batch: '',
  id_customer: -1,
  id_user: -1,
  order_hotspot: newOrderHotspot,
  order_client: newOrderClient,
  user: newUser,
  amount: '1',
  customer: newCustomer,
  package: newPackage,
  payment: PaymentType.Cash,
} satisfies Order)

const updateCard = async (order: Order) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/orders`,
      {
        id_customer: order.customer.id,
        id_package: order.package.id,
        id_user: useAuthStore().$state.user.id,
        include_symbols: order.order_hotspot.include_symbols,
        include_numbers: order.order_hotspot.include_numbers,
        include_lowercase_letters: order.order_hotspot.include_lowercase_letters,
        include_uppercase_letters: order.order_hotspot.include_uppercase_letters,
        exclude_similar_characters: order.order_hotspot.exclude_similar_characters,
        exclude_ambiguous_characters: order.order_hotspot.exclude_ambiguous_characters,
        activated: order.order_hotspot.activated,
        amount: order.amount,
        payment: order.payment,
      },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
    )
    isModalOpen.value = false
    init({ message: 'berhasil membuat data', color: 'success' })
    emits('close')

    setTimeout(() => {
      location.reload()
    }, 2000)
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      init({ message: err.response.data.message, color: 'danger' })
    }
  }
}
</script>
