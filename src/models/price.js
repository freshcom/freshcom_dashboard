import _ from 'lodash'

export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Price',

      code: '',
      status: 'active',
      name: '',
      label: '',
      currencyCode: 'CAD',
      chargeAmountCents: null,
      estimateByDefault: false,
      estimateAveragePercentage: null,
      estimateMaximumPercentage: null,
      minimumOrderQuantity: 1,
      orderUnit: '',
      chargeUnit: '',
      taxOnePercentage: 0,
      taxTwoPercentage: 0,
      taxThreePercentage: 0,
      startTime: '',
      endTime: '',

      product: null,
      children: []
    }
  },

  getLowestPrice (prices, orderQuantity = 1, status = 'active') {
    prices = _.filter(prices, (price) => {
      return price.status === status
    })

    prices = _.orderBy(prices, ['minimumOrderQuantity'], ['desc'])

    let lowestPrice = _.find(prices, (p) => {
      return orderQuantity >= p.minimumOrderQuantity
    })

    return lowestPrice
  }
}
