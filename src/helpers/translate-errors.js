import _ from 'lodash'
import i18n from '@/i18n'

// TODO: rename this file
export default function (errors, namespace, interpolations = {}) {
  return _.reduce(errors, (result, errorArray, k) => {
    let errorObj = errorArray[0]

    let fieldKey = `fields.${namespace}.${k}`
    let fieldName = i18n.t(fieldKey)

    if (fieldName === fieldKey) {
      fieldName = _.capitalize(_.startCase(k))
    }

    let errorCode = errorObj['code']
    let errorMeta = errorObj['meta']

    let errorKey = `errors.${namespace}.${k}.${errorCode}`
    let errorInterpolations = Object.assign({}, { name: fieldName }, errorMeta, interpolations)
    let errorMsg = i18n.t(errorKey, errorInterpolations)

    if (errorKey === errorMsg) {
      errorMsg = i18n.t(`errors.common.${errorCode}`, errorInterpolations)
    }

    result[k] = errorMsg
    return result
  }, {})
}
