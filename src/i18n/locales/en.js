export default {
  locales: {
    'en': 'English (en)',
    'zh-CN': '简体中文 (zh-CN)'
  },
  hello: 'Hi',
  errors: {
    common: {
      required: '{name} is required.',
      format: '{name} is invalid.',
      taken: '{name} is taken.'
    },
    required: '{name} is required.',
    invalid: '{name} is invalid.',
    user: {
      confirmPassword: {
        notMatch: 'Confirm password does not match the password.'
      },
      currentPassword: {
        mustMatch: 'Current password is invalid.'
      }
    },
    unlock: {
      unlockable: {
        invalid: 'Unlockable is invalid or already unlocked.'
      }
    },
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
        canOnlyActiveOnePerMoq: 'There is already an active price that have the same minimum order quantity.',
        cannotChangeStatusOfOnlyActivePriceOfActiveProduct: 'Can not change status of the only Active Price of a Active Product.',
        cannotChangeStatusOfOnlyInternalPriceOfInternalProduct: 'Can not change status of the only Active/Internal Price of a Internal Product.'
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
        requirePrimaryActiveVariant: 'A Product with variants must have a Primary Active Variant in order to be marked Active.',
        requireAtLeastOneInternalVariant: 'A Product must have at least one Active/Internal Variant in order to be marked Internal.',
        requireAllItemActive: 'A Product with Item Mode set to All must have all of its Item set to Active in order to be marked Active.',
        requireAllItemInternal: 'A Product with Item Mode set to All must have all of its Item set to Active/Internal in order to be marked Internal.',
        requireActivePrice: 'A product must have an active price in order to be marked active.',
        requireInternalPrice: 'A Product must have a Active/Internal Price in order to be marked Internal.'
      }
    },
    account: {
      stripeCode: {
        invalidGrant: 'Unable to connect to Stripe, please try again.'
      }
    }
  },
  fields: {
    accountMembership: {
      role: {
        administrator: 'Administrator'
      }
    },
    sms: {
      status: {
        pending: 'Pending',
        sent: 'Sent'
      }
    },
    email: {
      status: {
        pending: 'Pending',
        sent: 'Sent'
      }
    },
    notificationTrigger: {
      status: {
        active: 'Active',
        draft: 'Draft'
      },
      actionType: {
        sendEmail: 'Send Email',
        sendSms: 'Send SMS',
        webhook: 'Webhook'
      }
    },
    fileCollection: {
      status: {
        active: 'Active',
        draft: 'Draft'
      }
    },
    orderLineItem: {
      fulfillmentStatus: {
        pending: 'Pending',
        fulfilled: 'Fulfilled',
        returned: 'Returned',
        discarded: 'Discarded'
      }
    },
    fulfillmentPackage: {
      systemLabel: {
        auto: 'Auto'
      },
      status: {
        pending: 'Pending',
        fulfilled: 'Fulfilled',
        partiallyReturned: 'Partially Returned',
        returned: 'Returned',
        discarded: 'Discarded'
      }
    },
    fulfillmentItem: {
      status: {
        fulfilled: 'Fulfilled',
        pending: 'Pending',
        returned: 'Returned',
        discarded: 'Discarded'
      }
    },
    returnPackage: {
      systemLabel: {
        auto: 'Auto'
      },
      status: {
        returned: 'Returned'
      }
    },
    returnItem: {
      status: {
        returned: 'Returned'
      }
    },
    refund: {
      gateway: {
        freshcom: 'Freshcom',
        custom: 'Custom'
      }
    },
    depositable: {
      status: {
        active: 'Active',
        printName: 'Print name'
      }
    },
    stockable: {
      status: {
        active: 'Active'
      }
    },
    unlockable: {
      status: {
        draft: 'Draft',
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
      },
      gateway: {
        freshcom: 'Freshcom',
        custom: 'Custom'
      }
    },
    customer: {
      status: {
        guest: 'Guest',
        registered: 'Registered',
        internal: 'Internal'
      }
    },
    order: {
      paymentStatus: {
        pending: 'Pending',
        partiallyAuthorized: 'Partially Authorized',
        authorized: 'Authorized',
        partiallyPaid: 'Partially Paid',
        paid: 'Paid',
        overPaid: 'Over Paid',
        partiallyRefunded: 'Partially Refunded',
        refunded: 'Refunded'
      },
      status: {
        opened: 'Opened',
        cart: 'Cart'
      },
      fulfillmentMethod: {
        pickup: 'Pick Up',
        ship: 'Ship',
        digital: 'Digital'
      },
      fulfillmentStatus: {
        pending: 'Pending',
        fulfilled: 'Fulfilled',
        partially_returned: 'Partially Returned',
        returned: 'Returned',
        discarded: 'Discarded'
      }
    },
    product: {
      kind: {
        simple: 'Simple',
        item: 'Item',
        variant: 'Variant',
        combo: 'Combo',
        withVariants: 'with Variants'
      },
      status: {
        draft: 'Draft',
        active: 'Active',
        internal: 'Internal',
        disabled: 'Disabled'
      },
      nameSync: {
        disabled: 'Disabled',
        syncWithGoods: 'Sync with goods'
      }
    },
    productCollection: {
      status: {
        draft: 'Draft',
        active: 'Active',
        disabled: 'Disabled'
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
