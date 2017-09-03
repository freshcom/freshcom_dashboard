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
      estimateAveragePercentage: '',
      estimateMaximumPercentage: '',
      minimumOrderQuantity: 1,
      orderUnit: '',
      chargeUnit: '',
      publicOrderable: true,
      taxOnePercentage: 0,
      taxTwoPercentage: 0,
      taxThreePercentage: 0,
      startTime: '',
      endTime: ''
    }
  }
}
