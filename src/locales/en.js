export default {
  hello: 'Hi',
  errors: {
    required: '{name} is required.',
    invalid: '{name} is invalid.',
    payment: {
      source: {
        cardDeclined: 'Your card was declined, please try another card.',
        expiredCard: 'Your card has expired, please try another card.'
      }
    },
    price: {
      id: {
        onlyDisabledCanBeDeleted: 'Only Disabled Price can be deleted. Please update the status of the Price to Disabled, then try again.'
      },
      status: {
        canOnlyActiveOnePerMoq: 'There is already an Active Price that have the same Minimum Order Quantity.',
        cannotChangeStatusOfOnlyActivePriceOfActiveProductItem: 'Can not change status of the only Active Price of a Active Product Item. Please update the status of the corresponding Product Item first, then try again.',
        cannotChangeStatusOfOnlyInternalPriceOfInternalProductItem: 'Can not change status of the only Active/Internal Price of a Internal Product Item. Please update the status of the corresponding Product Item first, then try again.'
      }
    },
    productItem: {
      id: {
        onlyDisabledCanBeDeleted: 'Only Disabled Product Item can be deleted. Please update the status of the Product Item to Disabled, then try again.'
      },
      status: {
        requireAtLeastOneActivePrice: 'A Product Item must have at least one Active Price in order to be marked Active.',
        requireAtLeastOneInternalPrice: 'A Product Item must have at least one Active or Internal Price in order to be marked Internal.',
        cannotChangeStatusOfOnlyActiveItemOfActiveProduct: 'Can not change status of the only Active Product Item of a Active Product. Please update the status of the corresponding Product first, then try again.',
        cannotChangeStatusOfOnlyInternalItemOfInternalProduct: 'Can not change status of the only Active/Internal Product Item of a Internal Product. Please update the status of the corresponding Product first, then try again.'
      }
    },
    product: {
      status: {
        requirePrimaryActiveItem: 'A Product must have a Primary Active Item in order to be marked Active.',
        requireAtLeastOneInternalItem: 'A Product must have at least one Active/Internal Item in order to be marked Internal.',
        requireAllItemActive: 'A Product with Item Mode set to All must have all of its Item set to Active in order to be marked Active.',
        requireAllItemInternal: 'A Product with Item Mode set to All must have all of its Item set to Active/Internal in order to be marked Internal.',
        requireAtLeastOneActivePrice: 'A Product with Item Mode set to All require at least one Active Price in order to be marked Active.',
        requireAtLeastOneInternalPrice: 'A Product with Item Mode set to All require at least one Active/Internal Price in order to be marked Internal.'
      }
    },
    account: {
      stripeCode: {
        invalidGrant: 'Unable to connect to Stripe, please try again.'
      }
    }
  },
  attributes: {
    sku: {
      status: {
        active: 'Active'
      }
    },
    payment: {
      status: {
        pending: 'Pending',
        authorized: 'Authorized',
        paid: 'Paid',
        partially_refunded: 'Partially Refunded',
        refunded: 'Refunded'
      }
    },
    customer: {
      status: {
        registered: 'Registered'
      }
    },
    order: {
      status: {
        opened: 'Opened',
        cart: 'Cart'
      },
      fulfillmentMethod: {
        pickup: 'Pick Up',
        ship: 'Ship'
      }
    },
    product: {
      status: {
        draft: 'Draft',
        active: 'Active',
        internal: 'Internal',
        disabled: 'Disabled'
      }
    },
    productItem: {
      status: {
        draft: 'Draft',
        active: 'Active',
        internal: 'Internal',
        disabled: 'Disabled'
      },
      nameSync: {
        disabled: 'Disabled',
        sync_with_source: 'Sync with source',
        sync_with_product: 'Sync with product'
      }
    },
    price: {
      status: {
        draft: 'Draft',
        active: 'Active',
        internal: 'Internal',
        disabled: 'Disabled'
      }
    }
  },
  warnDanger: {
    locale: {
      message: 'Are you sure you want to change resource language? If you change, the data will be reloaded and your unsaved changes for the current resource language will be discarded.',
      confirm: 'Change',
      cancel: 'Cancel'
    },
    nav: {
      message: 'Are you sure you want to leave this screen? If you leave, your unsaved changes will be discarded.',
      confirm: 'Leave',
      cancel: 'Stay'
    }
  }
}
