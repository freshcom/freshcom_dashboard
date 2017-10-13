import _ from 'lodash'

export default function (type, errorKey, errorLabel) {
  type = _.camelCase(type)
  let commonLabels = ['required', 'invalid']

  if (_.indexOf(commonLabels, errorLabel) !== -1) {
    return `errors.${errorLabel}`
  } else {
    return `errors.${type}.${errorKey}.${errorLabel}`
  }
}
