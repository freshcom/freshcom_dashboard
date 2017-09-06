export default {
  hello: 'Hi',
  errors: {
    required: '{name} is required.',
    invalid: '{name} is invalid.',
    require_at_least_one_active_price: 'A Product Item must have at least one Active Price in order to be marked active.'
  },
  attributes: {
    productItem: {
      status: {
        draft: 'Draft',
        active: 'Active',
        internal: 'Internal'
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
        internal: 'Internal'
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
