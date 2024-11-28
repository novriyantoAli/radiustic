import { Ref, ref, unref, watch } from 'vue'
import {
  updateRadreply,
  addRadreply,
  removeRadreply,
  type Filters,
  Pagination,
  Sorting,
  getRadreplys,
} from '../../../data/pages/radreply'
import { Radreply } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'groupname', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useRadreplys = (
  param: string,
  options?: {
    pagination?: Ref<Pagination>
    sorting?: Ref<Sorting>
    filters?: Ref<Partial<Filters>>
  },
) => {
  const isLoading = ref(false)
  const radreplys = ref<Radreply[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getRadreplys(param, {
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    radreplys.value = data

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

    radreplys,

    fetch,

    async add(radreply: Radreply) {
      isLoading.value = true
      await addRadreply(radreply)
      await fetch()
      isLoading.value = false
    },

    async update(radreply: Radreply) {
      isLoading.value = true
      await updateRadreply(radreply)
      await fetch()
      isLoading.value = false
    },

    async remove(radreply: Radreply) {
      isLoading.value = true
      await removeRadreply(radreply)
      await fetch()
      isLoading.value = false
    },
  }
}
