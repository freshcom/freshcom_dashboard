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
      chargeCents: null,
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

      productItem: null
    }
  },

  getLowestActivePrice (prices, orderQuantity = 1, currentPrice = undefined) {
    let activePrices = _.filter(prices, (price) => {
      return price.status === 'active'
    })

    activePrices = _.orderBy(activePrices, ['minimumOrderQuantity'], ['desc'])

    let lowestActivePrice = _.find(activePrices, (p) => {
      return orderQuantity >= p.minimumOrderQuantity
    })

    if (!lowestActivePrice) {
      return currentPrice
    }

    if (currentPrice && currentPrice.status !== 'active' && currentPrice.chargeCents <= lowestActivePrice.chargeCents) {
      return currentPrice
    }

    return lowestActivePrice
  }
}
