import store from 'src/store'
import { STANDARD_PAGINATION } from 'src/utils/const'

export const getInitialPagination = (paginationType) => {
  const pagination = store.getters.paginationByType(paginationType)
  return {
    ...STANDARD_PAGINATION,
    ...pagination
  }
}
