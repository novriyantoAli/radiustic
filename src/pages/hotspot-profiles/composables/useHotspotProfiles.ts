import { Ref, ref, unref, watch } from 'vue'
import {
  updateHotspotProfile,
  addHotspotProfile,
  removeHotspotProfile,
  type Filters,
  Pagination,
  Sorting,
  getHotspotProfiles,
} from '../../../data/pages/hotspot-profiles'
import { HotspotProfile } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'username', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useHotspotProfiles = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const hprofiles = ref<HotspotProfile[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getHotspotProfiles({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    hprofiles.value = data

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

    hprofiles,

    fetch,

    async add(hprofile: HotspotProfile) {
      isLoading.value = true
      await addHotspotProfile(hprofile)
      await fetch()
      isLoading.value = false
    },

    async update(hprofile: HotspotProfile) {
      isLoading.value = true
      await updateHotspotProfile(hprofile)
      await fetch()
      isLoading.value = false
    },

    async remove(hprofile: HotspotProfile) {
      isLoading.value = true
      await removeHotspotProfile(hprofile)
      await fetch()
      isLoading.value = false
    },
  }
}
