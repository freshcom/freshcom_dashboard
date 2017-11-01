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

      fulfillmentMethod: 'ship',
      subTotalCents: 0,
      taxOneCents: 0,
      taxTwoCents: 0,
      taxThreeCents: 0,
      grandTotalCents: 0,
      authorizationCents: 0,

      rootLineItems: []
    }
  }
}
