import _ from 'lodash'
import axios from 'axios'
import { exportFile, Notify } from 'quasar'

export const createParamsFromTableProps = ({ pagination }) => {
  const { rowsPerPage, sortBy, descending, page } = pagination
  const sortString = descending ? `-${sortBy}` : sortBy
  return {
    page,
    limit: rowsPerPage,
    sort: sortString
  }
}

export const loadSavedPagination = (pagination = {}, params = {}) => {
  console.debug({ pagination, params })
  const {
    page = 1,
    rowsPerPage,
    limit,
    sort
  } = params

  let newPagination = {
    ...pagination
  }

  if (!_.isEmpty(params)) {
    newPagination = {
      ...newPagination,
      page,
      rowsPerPage: rowsPerPage || limit,
      sortBy: sort ? _.replace(sort, '-', '') : undefined,
      descending: sort ? sort.startsWith('-') : undefined
    }
  }

  return newPagination
}

export const getPaginatedEntities = async (entity, queryParams = {}) => {
  const params = { ...queryParams, count: true }
  const { data, headers } = await axios.get(entity, { params })
  const rowsNumber = Number(headers['odin-count'])
  return { data, rowsNumber }
}

export const getNameSurname = (item) => {
  const name = _.get(item, 'name', '')
  const surname = _.get(item, 'surname', '')
  if (!name && !surname) return ' - '
  return `${name} ${surname}`
}

export const fromCents = (num) => {
  if (num && !isNaN(num)) {
    return num / 100
  }
}

export const toCents = (num) => {
  if (num && !isNaN(num)) {
    return Math.round(+num * 100)
  }
}

export const formatCurrency = (num = 0) => {
  if (!num) {
    return `${Number(0).toFixed(2)}€`
  }
  return `${Number(_.divide(num, 100)).toFixed(2)}€`
}

export const downloadFile = async (filePath) => {
  if (!filePath) return
  const file = await fetch(filePath)
  exportFile(filePath.split('/')[filePath.split('/').length - 1], await file.blob())
}

export const generateRandomColorFromString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    color += ('00' + value.toString(16)).substr(-2)
  }
  console.debug({ color })
  return color
}

export const notify = {
  success: (message) => Notify.create({ message }),
  warning: (message) => Notify.create({ message, color: 'warning' }),
  error: (message) => Notify.create({ message, color: 'negative' })
}
