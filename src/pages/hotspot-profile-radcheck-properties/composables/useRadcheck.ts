import { Ref, ref, unref, watch } from 'vue'
import {
  updateRadcheck,
  addRadcheck,
  removeRadcheck,
  type Filters,
  Pagination,
  Sorting,
  getRadchecks,
} from '../../../data/pages/radcheck'
import { Radcheck } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'groupname', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useRadchecks = (
  param: string,
  options?: {
    pagination?: Ref<Pagination>
    sorting?: Ref<Sorting>
    filters?: Ref<Partial<Filters>>
  },
) => {
  const isLoading = ref(false)
  const radchecks = ref<Radcheck[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getRadchecks(param, {
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    radchecks.value = data

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

    radchecks,

    fetch,

    async add(radcheck: Radcheck) {
      isLoading.value = true
      await addRadcheck(radcheck)
      await fetch()
      isLoading.value = false
    },

    async update(radcheck: Radcheck) {
      isLoading.value = true
      await updateRadcheck(radcheck)
      await fetch()
      isLoading.value = false
    },

    async remove(radcheck: Radcheck) {
      isLoading.value = true
      await removeRadcheck(radcheck)
      await fetch()
      isLoading.value = false
    },
  }
}
