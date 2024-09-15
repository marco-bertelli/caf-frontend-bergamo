import { createLogger, createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import userData from './modules/userData'
import navigationInfo from './modules/navigationInfo'

const store = createStore({
  modules: {
    userData,
    navigationInfo
  },
  plugins: [
    createLogger(),
    createPersistedState({
      key: 'caf',
      paths: ['userData']
    })
  ],
  strict: process.env.DEV

})

export default store
