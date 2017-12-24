export default {
  objectWithDefaults (overwrites = { customer: null }) {
    return {
      id: undefined,
      type: 'Order',

      code: '',
      firstName: 'test',
      lastName: 'test',
      email: 'test@example.com',
      status: 'cart',

      fulfillmentMethod: 'pickup',
      subTotalCents: 0,
      taxOneCents: 0,
      taxTwoCents: 0,
      taxThreeCents: 0,
      grandTotalCents: 0,
      authorizationTotalCents: 0,

      rootLineItems: [],

      customer: overwrites.customer
    }
  }
}
