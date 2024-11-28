<template>
  <VaCard class="mb-6">
    <VaCardContent>
      <h2 class="page-sub-title">Orders</h2>
      <template v-for="(item, index) in dtx" :key="item.id">
        <div class="flex items-center justify-between md:justify-items-stretch">
          <div class="flex items-center w-100">
            {{ item.id_batch }}
            |
            {{ item.customer.name }}
            |
            {{ item.amount }} pcs | Hutang: {{ formatMoney(creditSize(sumArray(item.payment))) }}
            |
            {{
              new Date(item.created_at).toLocaleTimeString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            }}
          </div>
          <div class="w-50">
            <div v-if="creditSize(sumArray(item.payment)) > 0">
              <VaPopover message="bayar" placement="left">
                <VaButton size="small" icon="vapaid" color="warning" @click="pay(item)"></VaButton>
              </VaPopover>
              <VaModal v-slot="{ hide }" v-model="showModalPay" hide-default-actions>
                <div class="flex flex-col items-start gap-2">
                  <h3 class="va-h3">Nested Modal</h3>

                  <VaInput v-model="idbatch" outline />
                  <VaInput v-model="amount" outline />
                </div>

                <div class="flex justify-end mt-2 gap-2">
                  <VaButton preset="secondary" color="secondary" @click="hide()"> Cancel </VaButton>
                  <VaButton @click="payOrder()"> Save </VaButton>
                </div>
              </VaModal>
            </div>
            <div v-if="item.order_hotspot.id_batch != ''">
              <VaPopover message="cetak" placement="left">
                <VaButton size="small" icon="vaprint" preset="primary" @click="print(item)"></VaButton>
              </VaPopover>
            </div>
            <div v-else>
              <VaPopover message="lihat" placement="left">
                <VaButton size="small" icon="vadescription" color="success" @click="setData(item)"></VaButton>
              </VaPopover>
              <VaModal v-model="showModal" fullscreen hide-default-actions>
                <div class="flex flex-col gap-2">
                  <h3 class="va-h3">Nota Order / Faktur {{ data.id_batch }}</h3>
                  <div class="flex items-center justify-between md:justify-items-stretch">
                    <div
                      class="flex grow flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1 justify-between items-start md:items-center"
                    >
                      <div class="flex items-center md:w-48">
                        <div class="font-bold">{{ data.customer.name }}</div>
                        <!-- <div class="font-bold">{{ plan.name }}</div> -->
                        <!-- <VaBadge v-if="plan.type === 'current'" class="ml-2" color="success" text="Selected" /> -->
                      </div>
                      <div class="md:w-48">
                        <p class="mb-1">{{ data.amount }} pcs</p>
                        <!-- <p class="mb-1">{{ plan.padletsTotal }} padlets</p> -->
                        <p>
                          Harga: {{ data.order_client.client.price }} / {{ data.order_client.client.validity_value }}
                          {{ data.order_client.client.validity_unit }}
                        </p>
                        <!-- <p>{{ plan.uploadLimit }}&nbsp;/upload</p> -->
                      </div>
                      <div class="md:w-58">
                        <!-- <template v-if="plan.priceMonth"> -->
                        <!-- <p class="mb-1">{{ plan.priceMonth }}&nbsp;/month</p> -->
                        <p class="mb-1">Jumlah User: {{ data.order_client.client.session }}</p>
                        <p>Berlaku sampai: {{ data.order_client.expire }}</p>
                        <!-- <p>{{ plan.priceYear }}&nbsp;/year</p> -->
                        <!-- <p v-else>Free</p> -->
                      </div>
                    </div>
                    <div class="md:w-48 flex justify-end">
                      <!-- <div v-if="plan.type === 'current'" class="font-bold">{{ plan.padletsUsed }} padlets used</div>
            <VaButton v-else-if="plan.type === 'upgrade'" @click="switchPlan(plan.id)">Upgrade</VaButton>
            <VaButton v-else preset="primary" @click="switchPlan(plan.id)">Downgrade</VaButton> -->
                    </div>
                  </div>

                  <VaDivider />
                  <h2 class="page-sub-title">Informasi Akun Pengguna</h2>
                  <div class="va-table-responsive">
                    <table class="va-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Password</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="idx in data.order_client.client.session" :key="idx">
                          <td>{{ data.order_client.client.username + idx }}</td>
                          <td>{{ data.order_client.client.password }}</td>
                          <td>
                            <VaBadge text="aktiv" color="success" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="flex flex-wrap gap-5">
                    <VaCard>
                      <VaImage :src="buildImage('cara-login-1.jpg')" class="h-52" />
                      <VaCardTitle>Langkah 1</VaCardTitle>
                      <VaCardContent> Silahkan Klik pada menu RUMAHAN / KLIEN </VaCardContent>
                    </VaCard>

                    <VaCard>
                      <VaImage :src="buildImage('cara-login-2.jpg')" class="h-52" />
                      <VaCardTitle>Langkah 2</VaCardTitle>
                      <VaCardContent> Masukkan Username serta Password dan tekan tombol LOGIN </VaCardContent>
                    </VaCard>

                    <VaCard>
                      <VaImage :src="buildImage('cara-login-3.jpg')" class="h-52" />
                      <VaCardTitle>INFORMASI</VaCardTitle>
                      <VaCardContent> Informasi Username dan Password bisa dilihat di atas </VaCardContent>
                    </VaCard>
                  </div>
                </div>
              </VaModal>
            </div>
            <!-- <VaButton preset="primary" @click="print(item)">Cetak</VaButton> -->
          </div>
        </div>
        <VaDivider v-if="index !== dtx.length - 1" />
      </template>
    </VaCardContent>
    <VaCardActions vertical class="flex flex-wrap content-center mt-4">
      <VaButton preset="primary" @click="increaseNumberOfInvoices()"> Lainnya ... </VaButton>
    </VaCardActions>
  </VaCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'vuestic-ui'
import axios from 'axios'
import { Order } from './types'

import { useAuthStore } from '../../stores/auth-store'
import { pdf_voucher } from '../../helpers/pdf_voucher'

const { init } = useToast()

let lastID = 0

const dtx = ref<Order[]>([])

const showModal = ref(false)

const showModalPay = ref(false)

const idbatch = ref('-')

const amount = ref('-')

const data = ref(Object)

const buildImage = (name: string) => {
  return `${import.meta.env.VITE_APP_PUBLIC}/public/upload/img/${name}`
}

const print = async (item: any) => {
  pdf_voucher('voucher', item)
}

const payOrder = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/payments`,
      {
        id_batch: idbatch.value,
        amount: amount.value,
      },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useAuthStore().$state.user.token}` } },
    )
    init({ message: res.data.message, color: 'success' })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      init({ message: error.response.data.message, color: 'danger' })
    } else {
      init({ message: 'unknown error', color: 'danger' })
    }
  }

  showModalPay.value = false
}

const pay = async (item: any) => {
  showModalPay.value = !showModalPay.value
  idbatch.value = item.id_batch
  // try {
  //   const res = await axios.post(`${import.meta.env.VITE_API_URL}/payments`, {
  //     id_batch: item.id_batch,
  //     amount: order.order_client.client.id,
  //     payment: order.payment,
  //     amount: order.amount
  //   }, { headers: {'Content-Type': 'application/json', "Authorization" : `Bearer ${useAuthStore().$state.user.token}`} });
  // } catch(error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     init({ message: error.response.data.message, color: 'danger' });
  //   } else {
  //     init({ message: 'unknown error', color: 'danger'});
  //   }
  // }
}

const formatMoney = (amount: number, currency = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(amount)
}

const setData = (item: any) => {
  showModal.value = !showModal.value

  data.value = item
}

const creditSize = (item: any) => {
  if (item.length <= 0) {
    return 0
  }

  if (item.length == 1) {
    return item[0]['amount']
  }

  return item[0]['amount'] - item[1]['amount']
}

const sumArray = (item: any) => {
  const result: any[] = []
  item.reduce(function (res: any, value: any) {
    if (!res[value.status]) {
      res[value.status] = { status: value.status, amount: 0 }
      result.push(res[value.status])
    }
    res[value.status].amount += value.amount
    return res
  }, {})

  return result
}

const increaseNumberOfInvoices = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders?last=${lastID}`, {
      headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
    })
    const recentData = res.data.data as Order[]
    if (recentData.length > 0 && recentData[0].id < lastID) {
      dtx.value = dtx.value.concat(recentData)
      lastID = recentData[recentData.length - 1].id
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      init({ message: error.response.data.message, color: 'danger' })
    } else {
      init({ message: 'unknown error', color: 'danger' })
    }
  }
}

;(async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
      headers: { Authorization: `Bearer ${useAuthStore().$state.user.token}` },
    })
    const recentData = res.data.data as Order[]
    dtx.value = recentData
    if (recentData.length > 0) {
      lastID = recentData[recentData.length - 1].id
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      init({ message: error.response.data.message, color: 'danger' })
    } else {
      init({ message: 'unknown error', color: 'danger' })
    }
  }
})()
</script>
