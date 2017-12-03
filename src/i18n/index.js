import _ from 'lodash'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { DEFAULT_LOCALE } from '@/env'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import en from '@/i18n/locales/en'
import zh from '@/i18n/locales/zh-CN'

Vue.use(VueI18n)
export default new VueI18n({
  locale: DEFAULT_LOCALE,
  messages: {
    'en': _.merge(elementEnLocale, en),
    'zh-CN': _.merge(elementZhLocale, zh)
  }
})
