import axios from 'axios'
import _ from 'lodash'
import { notify } from 'src/utils'
import { t } from 'boot/i18n'
import { fromISOToFormat } from 'src/utils/date'
import { DATE_TIME_FORMAT } from 'src/utils/const'

const state = {
  token: null,
  details: null,
  drawer: {
    left: null
  }
}

const getters = {
  isAuthenticated (state) {
    return !_.isNil(state.token)
  },
  token (state) {
    return state.token
  },
  currentUser (state) {
    return state.details
  },
  currentUserRole (state) {
    return _.get(state, 'details.role') || 'user'
  },
  currentUserLastLogin (state) {
    return fromISOToFormat(state?.details?.last_login, DATE_TIME_FORMAT)
  },
  currentUserIsAdmin (state) {
    return _.isEqual(_.get(state, 'details.role'), 'admin')
  },
  left (state) {
    return state.drawer?.left
  }
}

const mutations = {
  setUserToken (state, token) {
    state.token = token
  },
  setUserDetail (state, details) {
    state.details = details
  },
  logout (state) {
    state.token = null
    state.details = null
  },
  setLeftDrawer: (state, payload) => {
    state.drawer.left = payload
  }
}

const actions = {
  login: async function ({ commit, dispatch }, payload) {
    const { email, password } = payload
    try {
      const { data } = await axios({
        url: '/auth',
        method: 'post',
        headers: {
          Authorization: 'Basic ' + btoa(email + ':' + password)
        }
      })
      commit('setUserToken', data.token)
      commit('setUserDetail', data.user)
      notify.success(t('common.welcome', { name: data.user.name }))
      return Promise.resolve(data.user)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
