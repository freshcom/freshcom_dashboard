import _ from 'lodash'

import OrderLineItemAPI from '@/api/order-line-item'
import PriceAPI from '@/api/price'
import OrderAPI from '@/api/order'
import CustomerAPI from '@/api/customer'
import PaymentAPI from '@/api/payment'
import RefundAPI from '@/api/refund'
import JSONAPI from '@/jsonapi'

import Order from '@/models/order'
import OrderLineItem from '@/models/order-line-item'
import Payment from '@/models/payment'
import Refund from '@/models/refund'

const MT = {
  RECORD_CHANGED: 'RECORD_CHANGED',
  RECORD_DRAFT_CHANGED: 'RECORD_DRAFT_CHANGED',
  RECORD_RESET: 'RECORD_RESET',
  RECORD_LOADING: 'RECORD_LOADING',
  RECORDS_CHANGED: 'RECORDS_CHANGED',
  RECORDS_LOADING: 'RECORDS_LOADING',
  LINE_ITEM_ADD_STARTED: 'LINE_ITEM_ADD_STARTED',
  LINE_ITEM_ADD_ENDED: 'LINE_ITEM_ADD_ENDED',
  LINE_ITEM_EDIT_STARTED: 'LINE_ITEM_EDIT_STARTED',
  LINE_ITEM_EDIT_ENDED: 'LINE_ITEM_EDIT_ENDED',
  LINE_ITEM_DRAFT_FOR_CREATE_CHANGED: 'LINE_ITEM_DRAFT_FOR_CREATE_CHANGED',
  LINE_ITEM_DRAFT_FOR_UPDATE_CHANGED: 'LINE_ITEM_DRAFT_FOR_UPDATE_CHANGED',
  LINE_ITEM_DRAFT_FOR_CREATE_RESET: 'LINE_ITEM_DRAFT_FOR_CREATE_RESET',
  SELECTED_PRICES_CHANGED: 'SELECTED_PRICES_CHANGED',
  SELECTABLE_CUSTOMERS_CHANGED: 'SELECTABLE_CUSTOMERS_CHANGED',
  SELECTABLE_CUSTOMERS_LOADING: 'SELECTABLE_CUSTOMERS_LOADING',
  SELECTABLE_CUSTOMERS_RESET: 'SELECTABLE_CUSTOMERS_RESET',
  PAYMENT_CAPTURE_STARTED: 'PAYMENT_CAPTURE_STARTED',
  PAYMENT_CAPTURE_ENDED: 'PAYMENT_CAPTURE_ENDED',
  REFUND_ADD_STARTED: 'REFUND_ADD_STARTED',
  REFUND_ADD_ENDED: 'REFUND_ADD_ENDED'
}

export default {
  namespaced: true,
  state: {
    record: Order.objectWithDefaults(),
    recordDraft: Order.objectWithDefaults(),
    isLoadingRecord: true,
    records: [],
    isLoadingRecords: true,
    isEditingLineItem: false,
    isAddingLineItem: false,
    lineItemDraftForCreate: OrderLineItem.objectWithDefaults(),
    lineItemDraftForUpdate: OrderLineItem.objectWithDefaults(),
    paymentDraftForCapture: Payment.objectWithDefaults(),
    selectablePrices: [],
    isLoadingSelectableCustomers: true,
    selectableCustomers: [],
    isCapturingPayment: false,
    isAddingRefund: false,
    refundDraftForCreate: Refund.objectWithDefaults()
  },
  actions: {
    setRecord ({ commit }, record) {
      commit(MT.RECORD_CHANGED, record)
    },

    setRecordDraft ({ commit }, record) {
      commit(MT.RECORD_DRAFT_CHANGED, record)
    },

    resetRecord ({ commit }) {
      commit(MT.RECORD_RESET)
    },

    loadRecord ({ state, commit, rootState }, actionPayload) {
      commit(MT.RECORD_LOADING)
      if (state.record && state.record.id === actionPayload.id && state.record.locale === rootState.resourceLocale) {
        return new Promise((resolve, reject) => {
          resolve(state.record)
        })
      }

      if (state.record.id !== actionPayload.id) {
        commit(MT.RECORD_RESET)
      }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return OrderAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createRecord (context, recordDraft) {
      let apiPayload = { data: JSONAPI.serialize(recordDraft) }
      return OrderAPI.createRecord(apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).then(record => {
        context.commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateRecord ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.recordDraft) }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return OrderAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    loadRecords ({ state, commit, rootState }, actionPayload) {
      commit(MT.RECORDS_LOADING)
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return OrderAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.RECORDS_CHANGED, response.resources)

        return response
      })
    },

    deleteRecord ({ commit }, id) {
      return OrderAPI.deleteRecord(id).then(response => {
        commit(MT.RECORD_RESET)

        return response
      })
    },

    loadSelectableCustomers ({ state, commit, rootState }, actionPayload) {
      commit(MT.SELECTABLE_CUSTOMERS_LOADING)
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return CustomerAPI.queryRecord(actionPayload).then(response => {
        let apiPayload = response.data
        return { meta: response.data.meta, resources: JSONAPI.deserialize(apiPayload.data, apiPayload.included) }
      }).then(response => {
        commit(MT.SELECTABLE_CUSTOMERS_CHANGED, response.resources)

        return response
      }).catch(error => {
        console.log(error)
      })
    },

    resetSelectableCustomers ({ commit }) {
      commit(MT.SELECTABLE_CUSTOMERS_RESET)
    },

    createLineItem ({ state, commit }, lineItemDraft) {
      let orderCreated = new Promise((resolve, reject) => {
        resolve(lineItemDraft.order)
      })
      if (!lineItemDraft.order.id) {
        let order = Order.objectWithDefaults()
        let payload = { data: JSONAPI.serialize(order) }

        orderCreated = OrderAPI.createRecord(payload).then(response => {
          return JSONAPI.deserialize(response.data.data)
        })
      }

      return orderCreated.then(order => {
        let apiPayload = { data: JSONAPI.serialize(lineItemDraft) }
        return Promise.all([OrderLineItemAPI.createRecord(order.id, apiPayload), order])
      }).then(responses => {
        let order = responses[1]
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children,payments' })
      }).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)
        commit(MT.LINE_ITEM_ADD_ENDED)
        commit(MT.LINE_ITEM_DRAFT_FOR_CREATE_RESET)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateLineItem ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.lineItemDraft) }
      let order = actionPayload.lineItemDraft.order

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return OrderLineItemAPI.updateRecord(actionPayload.id, apiPayload, options).then(() => {
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children,payments' })
      }).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)
        commit(MT.LINE_ITEM_EDIT_ENDED)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    deleteLineItem ({ state, commit }, lineItem) {
      let order = lineItem.order

      return OrderLineItemAPI.deleteRecord(lineItem.id).then(() => {
        console.log(order)
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children,payments' })
      }).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    capturePayment ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.paymentDraft) }
      let order = actionPayload.paymentDraft.order
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return PaymentAPI.updateRecord(actionPayload.id, apiPayload, options).then(() => {
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children,payments' })
      }).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        commit(MT.RECORD_CHANGED, record)
        commit(MT.PAYMENT_CAPTURE_ENDED)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createRefund ({ state, commit }, refundDraft) {
      let apiPayload = { data: JSONAPI.serialize(refundDraft) }
      let order = refundDraft.payment.order

      return RefundAPI.createRecord(refundDraft.payment.id, apiPayload).then(() => {
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children,payments' })
      }).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        commit(MT.RECORD_CHANGED, record)
        commit(MT.REFUND_ADD_ENDED)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    loadSelectablePricesForLineItem ({ commit, rootState }, lineItem) {
      let filter = {}
      if (lineItem.productItem) {
        filter.productItemId = lineItem.productItem.id
      }
      if (lineItem.product) {
        filter.productId = lineItem.product.id
      }

      PriceAPI.queryRecord({ filter: filter, locale: rootState.resourceLocale }).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.SELECTED_PRICES_CHANGED, response.resources)

        return response
      })
    },

    startAddLineItem ({ commit, dispatch }, lineItem) {
      commit(MT.LINE_ITEM_ADD_STARTED, lineItem)
    },

    endAddLineItem ({ commit }) {
      commit(MT.LINE_ITEM_ADD_ENDED)
    },

    setLineItemDraftForCreate ({ commit }, lineItemDraft) {
      commit(MT.LINE_ITEM_DRAFT_FOR_CREATE_CHANGED, lineItemDraft)
    },

    startEditLineItem ({ commit, dispatch }, lineItem) {
      commit(MT.LINE_ITEM_EDIT_STARTED, lineItem)
    },

    endEditLineItem ({ commit }) {
      commit(MT.LINE_ITEM_EDIT_ENDED)
    },

    setLineItemDraftForUpdate ({ commit }, lineItemDraft) {
      commit(MT.LINE_ITEM_DRAFT_FOR_UPDATE_CHANGED, lineItemDraft)
    },

    startCapturePayment ({ commit }, payment) {
      commit(MT.PAYMENT_CAPTURE_STARTED, payment)
    },

    endCapturePayment ({ commit }) {
      commit(MT.PAYMENT_CAPTURE_ENDED)
    },

    startAddRefund ({ commit }, refund) {
      commit(MT.REFUND_ADD_STARTED, refund)
    },

    endAddRefund ({ commit }) {
      commit(MT.REFUND_ADD_ENDED)
    }
  },

  mutations: {
    [MT.RECORD_RESET] (state) {
      state.record = Order.objectWithDefaults()
      state.recordDraft = Order.objectWithDefaults()
    },

    [MT.RECORD_CHANGED] (state, record) {
      state.record = record
      state.recordDraft = record
      state.isLoadingRecord = false
    },

    [MT.RECORD_LOADING] (state, records) {
      state.isLoadingRecord = true
    },

    [MT.RECORD_DRAFT_CHANGED] (state, recordDraft) {
      state.recordDraft = recordDraft
    },

    [MT.RECORDS_CHANGED] (state, records) {
      state.records = records
      state.isLoadingRecords = false
    },

    [MT.RECORDS_LOADING] (state, records) {
      state.isLoadingRecords = true
    },

    [MT.LINE_ITEM_ADD_STARTED] (state, lineItem) {
      state.isAddingLineItem = true
    },

    [MT.LINE_ITEM_ADD_ENDED] (state, lineItem) {
      state.isAddingLineItem = false
    },

    [MT.LINE_ITEM_EDIT_STARTED] (state, lineItem) {
      state.lineItemDraftForUpdate = lineItem
      state.isEditingLineItem = true
    },

    [MT.LINE_ITEM_EDIT_ENDED] (state, lineItem) {
      state.isEditingLineItem = false
    },

    [MT.LINE_ITEM_DRAFT_FOR_CREATE_CHANGED] (state, lineItemDraftForCreate) {
      state.lineItemDraftForCreate = lineItemDraftForCreate
    },

    [MT.LINE_ITEM_DRAFT_FOR_UPDATE_CHANGED] (state, lineItemDraftForUpdate) {
      state.lineItemDraftForUpdate = lineItemDraftForUpdate
    },

    [MT.SELECTED_PRICES_CHANGED] (state, prices) {
      state.selectablePrices = prices
    },

    [MT.LINE_ITEM_DRAFT_FOR_CREATE_RESET] (state, prices) {
      state.lineItemDraftForCreate = OrderLineItem.objectWithDefaults()
    },

    [MT.SELECTABLE_CUSTOMERS_CHANGED] (state, customers) {
      state.selectableCustomers = customers
      state.isLoadingSelectableCustomers = false
    },

    [MT.SELECTABLE_CUSTOMERS_LOADING] (state) {
      state.isLoadingSelectableCustomers = true
    },

    [MT.SELECTABLE_CUSTOMERS_RESET] (state) {
      state.isLoadingSelectableCustomers = true
      state.selectableCustomers = []
    },

    [MT.PAYMENT_CAPTURE_STARTED] (state, payment) {
      state.paymentDraftForCapture = payment
      state.isCapturingPayment = true
    },

    [MT.PAYMENT_CAPTURE_ENDED] (state, lineItem) {
      state.isCapturingPayment = false
    },

    [MT.REFUND_ADD_STARTED] (state, refund) {
      state.refundDraftForCreate = refund
      state.isAddingRefund = true
    },

    [MT.REFUND_ADD_ENDED] (state) {
      state.isAddingRefund = false
    }
  }
}
