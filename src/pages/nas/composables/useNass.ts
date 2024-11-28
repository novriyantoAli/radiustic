import { Ref, ref, unref, watch } from 'vue'
import { updateNas, addNas, removeNas, type Filters, Pagination, Sorting, getNass } from '../../../data/pages/nass'
import { Nas } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'shortname', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useNass = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const nass = ref<Nas[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getNass({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    nass.value = data

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

    nass,

    fetch,

    async add(nas: Nas) {
      isLoading.value = true
      await addNas(nas)
      await fetch()
      isLoading.value = false
    },

    async update(nas: Nas) {
      isLoading.value = true
      await updateNas(nas)
      await fetch()
      isLoading.value = false
    },

    async remove(nas: Nas) {
      isLoading.value = true
      await removeNas(nas)
      await fetch()
      isLoading.value = false
    },
  }
}
