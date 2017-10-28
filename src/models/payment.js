export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Payment',
      status: 'paid',

      gateway: 'online',
      processor: 'stripe',
      method: '',
      source: '',
      saveSource: true,

      order: {}
    }
  }
}
