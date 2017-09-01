export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'ProductItem',

      code: '',
      status: 'draft',
      nameSync: 'disabled',
      name: '',
      printName: '',
      sourceQuantity: 1,
      sortIndex: 0,
      maximumPublicOrderQuantity: 9999,

      caption: '',
      desecription: '',

      product: {},
      sku: {},
      unlockable: {}
    }
  }
}
