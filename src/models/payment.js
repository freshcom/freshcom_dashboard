export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Payment',
      status: 'pending',

      gateway: 'online',
      processor: 'stripe',
      method: '',
      source: undefined,
      saveSource: true,
      useCardFrom: 'newCard',

      order: {}
    }
  }
}
