import { Ref, ref, unref, watch } from 'vue'
import {
  updateLevel,
  addLevel,
  removeLevel,
  type Filters,
  Pagination,
  Sorting,
  getLevels,
} from '../../../data/pages/levels'
import { Level } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'name', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useLevels = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const levels = ref<Level[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getLevels({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    levels.value = data

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

    levels,

    fetch,

    async add(level: Level) {
      isLoading.value = true
      await addLevel(level)
      await fetch()
      isLoading.value = false
    },

    async update(level: Level) {
      isLoading.value = true
      await updateLevel(level)
      await fetch()
      isLoading.value = false
    },

    async remove(level: Level) {
      isLoading.value = true
      await removeLevel(level)
      await fetch()
      isLoading.value = false
    },
  }
}
