import { Ref, ref, unref, watch } from 'vue'
import {
  updateUser,
  addUser,
  removeUser,
  resetPasswordUser,
  type Filters,
  Pagination,
  Sorting,
  getUsrs,
} from '../../../data/pages/users'
import { Usr } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'name', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useUsers = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const usrs = ref<Usr[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getUsrs({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    usrs.value = data

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

    // users,
    usrs,

    fetch,

    async add(user: Usr) {
      isLoading.value = true
      await addUser(user)
      await fetch()
      isLoading.value = false
    },

    async update(user: Usr) {
      isLoading.value = true
      await updateUser(user)
      await fetch()
      isLoading.value = false
    },

    async remove(user: Usr) {
      isLoading.value = true
      await removeUser(user)
      await fetch()
      isLoading.value = false
    },

    async resetPassword(user: Usr) {
      isLoading.value = true
      await resetPasswordUser(user)
      isLoading.value = false
    },
  }
}
