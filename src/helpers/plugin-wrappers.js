import { MessageBox } from 'element-ui'
import { i18n } from '@/main'

export function warnDanger (options = {}) {
  options.type = options.type || 'nav'

  return MessageBox.confirm(
    i18n.t(`warnDanger.${options.type}.message`),
    'Confirm',
    {
      confirmButtonText: i18n.t(`warnDanger.${options.type}.confirm`),
      cancelButtonText: i18n.t(`warnDanger.${options.type}.cancel`)
    }
  ).then(() => {
    if (options.confirm) {
      options.confirm()
    }

    return true
  }).catch(() => {
    if (options.cancel) {
      options.cancel()
    }

    return false
  })
}
