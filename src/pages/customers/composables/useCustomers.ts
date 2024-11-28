import { Ref, ref, unref, watch } from 'vue'
import {
  updateCustomer,
  addCustomer,
  removeCustomer,
  type Filters,
  Pagination,
  Sorting,
  getCustomers,
} from '../../../data/pages/customers'
import { Customer } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'name', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useCustomers = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const customers = ref<Customer[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getCustomers({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    customers.value = data

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(
    filters,
    () => {
      // Reset pagination to first page when filters changed
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  return {
    isLoading,

    filters,
    sorting,
    pagination,

    customers,

    fetch,

    async add(customer: Customer) {
      isLoading.value = true
      await addCustomer(customer)
      await fetch()
      isLoading.value = false
    },

    async update(customer: Customer) {
      isLoading.value = true
      await updateCustomer(customer)
      await fetch()
      isLoading.value = false
    },

    async remove(customer: Customer) {
      isLoading.value = true
      await removeCustomer(customer)
      await fetch()
      isLoading.value = false
    },
  }
}
