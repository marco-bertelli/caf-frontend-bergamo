import types from 'src/store/types'
import { values } from 'lodash'

const state = {
  ...values(types).reduce((acc, type) => {
    acc[type] = {}
    return acc
  }, {})
}

const getters = {
  paginationByType: state => type => {
    return state[type]
  },
  filtersByType: state => type => {
    return state[type]
  }
}

const mutations = {
  setNavigationData: (state, payload) => {
    const { type, data } = payload
    state[type] = data
  }
}

export default {
  state,
  mutations,
  getters
}
