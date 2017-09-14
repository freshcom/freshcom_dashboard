export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'OrderLineItem',

      name: '',
      printName: '',
      orderQuantity: 1,
      isEstimate: false,
      subTotalCents: null,

      product: null,
      productItem: null,
      sku: null,
      unlockable: null
    }
  }
}
