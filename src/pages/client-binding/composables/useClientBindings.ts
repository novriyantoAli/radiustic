import { Ref, ref, unref, watch } from 'vue'
import {
  updateClientBinding,
  addClientBinding,
  removeClientBinding,
  type Filters,
  Pagination,
  Sorting,
  getClientBindings,
} from '../../../data/pages/clientbindings'
import { ClientBinding } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'mac', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useClientBindings = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const clientbindings = ref<ClientBinding[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getClientBindings({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    clientbindings.value = data

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

    clientbindings,

    fetch,

    async add(clientbinding: ClientBinding) {
      isLoading.value = true
      await addClientBinding(clientbinding)
      await fetch()
      isLoading.value = false
    },

    async update(clientbinding: ClientBinding) {
      isLoading.value = true
      await updateClientBinding(clientbinding)
      await fetch()
      isLoading.value = false
    },

    async remove(clientbinding: ClientBinding) {
      isLoading.value = true
      await removeClientBinding(clientbinding)
      await fetch()
      isLoading.value = false
    },
  }
}
