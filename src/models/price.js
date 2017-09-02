export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Price',

      code: '',
      status: 'draft',
      name: '',
      label: '',
      currencyCode: 'CAD',
      chargeCents: 0,
      estimateByDefault: false,
      estimateAverageRatio: '',
      estimateMaximumRatio: '',
      minimumOrderQuantity: 1,
      orderUnit: '',
      chargeUnit: '',
      publicOrderable: true,
      taxOneRate: 0,
      taxTwoRate: 0,
      taxThreeRate: 0,
      startTime: '',
      endTime: ''
    }
  }
}
