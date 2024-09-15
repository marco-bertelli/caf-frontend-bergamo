import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import _ from 'lodash'
import { createParamsFromTableProps, getPaginatedEntities, loadSavedPagination } from 'src/utils'

export default function usePagination ({ entity, types, defaultFilters = {}, initialSort, initialRowsPerPage = 10, updateVuex = true }) {
  const store = useStore()
  const list = ref([])
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    rowsPerPage: initialRowsPerPage,
    rowsNumber: undefined,
    sortBy: initialSort,
    descending: undefined
  })

  const navigationStored = computed(() => {
    return store.getters.paginationByType(types.pagination)
  })

  const filtersStored = computed(() => {
    return store.getters.filtersByType(types.filters)
  })

  const onChangeFilters = async (newFilters) => {
    const { rowsNumber } = await getData(newFilters)
    pagination.value.page = 1
    pagination.value.rowsNumber = rowsNumber

    if (updateVuex) {
      store.commit('setNavigationData', {
        type: types.filters,
        data: _.cloneDeepWith(newFilters)
      })
    }
  }

  const getData = async (params = {}) => {
    try {
      loading.value = true
      const initialParams = {
        page: 1,
        limit: pagination.value.rowsPerPage,
        sort: pagination.value.sortBy
      }
      const { data, rowsNumber } = await getPaginatedEntities(entity, { ...initialParams, ...params, ...defaultFilters })
      list.value = _.cloneDeepWith(data)
      loading.value = false
      return { data, rowsNumber }
    } catch (e) {
      console.error({ e })
      loading.value = false
    }
  }

  const updateData = async () => {
    const { rowsNumber } = await getData(filtersStored.value)
    pagination.value = {
      ...pagination.value,
      rowsNumber: Number(rowsNumber)
    }
  }

  const request = async (props) => {
    const newParamsPagination = createParamsFromTableProps(props)
    if (!newParamsPagination.sort) newParamsPagination.sort = pagination.value.sortBy
    const updatedNavigationParams = { ...navigationStored.value, ...newParamsPagination }
    const { rowsNumber } = await getData({ ...updatedNavigationParams, ...filtersStored.value, ...defaultFilters })
    // console.debug({ rowsNumber })
    pagination.value = _.cloneDeepWith({
      ...updatedNavigationParams,
      rowsNumber: rowsNumber,
      rowsPerPage: updatedNavigationParams.limit || rowsNumber,
      sortBy: updatedNavigationParams.sort ? _.replace(updatedNavigationParams.sort, '-', '') : undefined,
      descending: updatedNavigationParams.sort ? updatedNavigationParams.sort.startsWith('-') : false
    })

    if (updateVuex) {
      store.commit('setNavigationData', {
        type: types.pagination,
        data: _.cloneDeepWith(updatedNavigationParams)
      })
    }
  }

  const updatePagination = (props) => {
    pagination.value = { ...pagination.value, ...props }
  }

  const created = async () => {
    const { rowsNumber } = await getData({ ...filtersStored.value, ...navigationStored.value })
    // console.debug({ rowsNumber })
    pagination.value.rowsNumber = rowsNumber
    pagination.value = loadSavedPagination(pagination.value, navigationStored.value)

    // console.debug({ pagination: pagination.value })
  }

  created()

  return {
    onChangeFilters,
    updatePagination,
    updateData,
    request,
    list,
    loading,
    pagination
  }
}
