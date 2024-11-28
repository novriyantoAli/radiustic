<template>
  <VaModal hide-default-actions model-value size="small" close-button @cancel="emits('close')">
    <h3 class="va-h4 mb-4">Buat orderan klien</h3>
    <HotspotClientEdit :order="order" submit-text="Buat Orderan" @cancel="emits('close')" @save="updateCard" />
  </VaModal>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import HotspotClientEdit from './HotspotClientEdit.vue'
import { PaymentType, Order, OrderClient, OrderHotspot } from '../types'
import { useToast } from 'vuestic-ui'
import { Client } from '../../clients/types'
import { Customer } from '../../customers/types'
import { Usr } from '../../users/types'
import { Level } from '../../levels/types'
import { HotspotPackage } from '../../hotspot-packages/types'
import { HotspotProfile } from '../../hotspot-profiles/types'
import { useAuthStore } from '../../../stores/auth-store'
import axios from 'axios'

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
  customer: newCustomer,
  validity_value: '',
  validity_unit: 'MONTH',
  notes: '',
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
  amount: '',
  order_hotspot: newOrderHotspot,
  order_client: newOrderClient,
  user: newUser,
  customer: newCustomer,
  package: newPackage,
  payment: PaymentType.Cash,
} satisfies Order)

const updateCard = async (order: Order) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/orders/client`,
      {
        id_user: useAuthStore().$state.user.id,
        id_client: order.order_client.client.id,
        payment: order.payment,
        amount: order.amount,
      },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
    )
    init({ message: 'berhasil membuat orderan', color: 'success' })
    isModalOpen.value = false

    emits('close')
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      init({ message: err.response.data.message, color: 'danger' })
    }
  }
}
</script>
