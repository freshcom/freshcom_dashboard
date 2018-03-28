export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Product',

      code: '',
      status: 'draft',
      kind: 'simple',

      nameSync: 'syncWithGoods',
      name: '',
      printName: '',

      goodsQuantity: 1,
      sortIndex: 0,
      maximumPublicOrderQuantity: 9999,
      autoFulfill: false,

      caption: '',
      description: '',

      avatar: null,
      items: [],
      variants: [],
      goods: {}
    }
  }
}
