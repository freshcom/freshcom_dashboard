export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Payment',
      status: 'pending',

      gateway: 'freshcom',
      processor: 'stripe',
      method: '',
      source: undefined,
      saveSource: true,
      useCardFrom: 'newCard',

      order: {}
    }
  }
}
