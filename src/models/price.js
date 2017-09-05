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
  }
}
