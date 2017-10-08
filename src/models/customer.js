export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Customer',

      code: '',
      status: 'anonymous',
      firstName: '',
      lastName: ''
    }
  },

  fullName (customer) {
    if (!customer.firstName && !customer.lastName) {
      return ''
    }

    return `${customer.firstName} ${customer.lastName}`
  }
}
