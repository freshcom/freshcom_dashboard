export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Product',

      code: '',
      status: 'draft',
      kind: 'simple',

      nameSync: 'disabled',
      name: '',
      printName: '',

      sourceQuantity: 1,
      sortIndex: 0,
      maximumPublicOrderQuantity: 9999,

      caption: '',
      description: '',

      avatar: null,
      items: [],
      variants: [],
      source: {}
    }
  }
}
