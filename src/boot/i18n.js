import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import _ from 'lodash'

const i18n = createI18n({
  locale: 'it-IT',
  fallbackLocale: 'it-IT',
  messages,
  warnHtmlInMessage: 'off',
  silentTranslationWarn: true,
  silentFallbackWarn: true
})

export default ({ app }) => {
  app.use(i18n)
}
const t = _.bind(i18n.global.t, i18n)
export { i18n, t }
