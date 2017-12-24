import _ from 'lodash'

export function startCase (string = '') {
  return _.startCase(string)
}

export function chargeDollar (price) {
  if (!price) {
    return ''
  }

  let str = (price.chargeAmountCents / 100).toFixed(2)
  return `$ ${str}/${price.chargeUnit}`
}

export function dollar (cents) {
  if (cents === undefined || cents === '') { return '' }
  let str = (Math.abs(cents) / 100).toFixed(2)
  if (cents < 0) {
    return `- $ ${str}`
  } else {
    return `$ ${str}`
  }
}

export function idLastPart (id) {
  return _.last(id.split('-'))
}
