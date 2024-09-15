import axios from 'axios'
import store from '../store'
import _ from 'lodash'
import { Notify } from 'quasar'
import { t } from 'boot/i18n'

axios.defaults.baseURL = process.env.API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.interceptors.request.use(
  conf => {
    conf.headers.common.Authorization = `Bearer ${store.getters.token}`
    return conf
  },
  error => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    let message = _.get(error, 'response.data.message', '')
    if (message === 'email must match regular expression /^\\S+@\\S+\\.\\S+$/') {
      message = 'emailInvalid'
    }
    if (error?.response.status === 401) {
      message = 'Unauthorized'
    }

    Notify.create({
      color: 'negative',
      message: message ? t(message.toString()) : t('notify.error'),
      icon: 'report_problem'
    })

    return Promise.reject(error)
  }
)

export default async ({ app }) => {
  app.config.globalProperties.$axios = axios
}
