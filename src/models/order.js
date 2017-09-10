export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Order',

      code: '',
      firstName: '',
      lastName: '',
      email: '',
      status: 'cart',

      lineItems: []
    }
  }
}
