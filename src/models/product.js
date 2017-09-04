export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Product',

      code: '',
      name: '',
      printName: '',
      status: 'draft',
      itemMode: 'any',

      caption: '',
      description: '',

      avatar: null,
      items: []
    }
  }
}
