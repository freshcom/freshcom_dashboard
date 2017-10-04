export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Payment',
      status: 'pending',

      gateway: 'online',
      processor: 'stripe',
      method: ''
    }
  }
}
