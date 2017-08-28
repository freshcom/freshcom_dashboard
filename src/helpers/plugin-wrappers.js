import { MessageBox } from 'element-ui'

export function warnDanger (options = {}) {
  options.type = options.type || 'nav'

  let typeText = {
    locale: {
      message: 'Are you sure you want to change resource language? If you change, the data will be reloaded and your unsaved changes for the current resource language will be discarded.',
      confirm: 'Change',
      cancel: 'Cancel'
    },
    nav: {
      message: 'Are you sure you want to leave this screen? If you leave, your unsaved changes will be discarded.',
      confirm: 'Leave',
      cancel: 'Stay'
    }
  }

  return MessageBox.confirm(
    typeText[options.type].message,
    'Confirm',
    {
      confirmButtonText: typeText[options.type].confirm,
      cancelButtonText: typeText[options.type].cancel
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
