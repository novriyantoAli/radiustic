import { Ref, ref, unref, watch } from 'vue'
import {
  updateHotspotPackage,
  addHotspotPackage,
  removeHotspotPackage,
  type Filters,
  Pagination,
  Sorting,
  getHotspotPackages,
} from '../../../data/pages/hotspot-packages'
import { HotspotPackage } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'name', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useHotspotPackages = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const hpackages = ref<HotspotPackage[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getHotspotPackages({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    hpackages.value = data

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

    hpackages,

    fetch,

    async add(hpackage: HotspotPackage) {
      isLoading.value = true
      await addHotspotPackage(hpackage)
      await fetch()
      isLoading.value = false
    },

    async update(hpackage: HotspotPackage) {
      isLoading.value = true
      await updateHotspotPackage(hpackage)
      await fetch()
      isLoading.value = false
    },

    async remove(hpackage: HotspotPackage) {
      isLoading.value = true
      await removeHotspotPackage(hpackage)
      await fetch()
      isLoading.value = false
    },
  }
}
