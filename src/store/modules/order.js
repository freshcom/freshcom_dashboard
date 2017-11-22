import _ from 'lodash'

import OrderLineItemAPI from '@/api/order-line-item'
import PriceAPI from '@/api/price'
import OrderAPI from '@/api/order'
import CustomerAPI from '@/api/customer'
import PaymentAPI from '@/api/payment'
import RefundAPI from '@/api/refund'
import JSONAPI from '@/jsonapi'

import Order from '@/models/order'
import Payment from '@/models/payment'
import Refund from '@/models/refund'

const MT = {
  RECORD_CHANGED: 'RECORD_CHANGED',
  RECORD_DRAFT_CHANGED: 'RECORD_DRAFT_CHANGED',
  RECORD_RESET: 'RECORD_RESET',
  RECORD_LOADING: 'RECORD_LOADING',
  RECORDS_CHANGED: 'RECORDS_CHANGED',
  RECORDS_LOADING: 'RECORDS_LOADING',
  PAYMENT_FOR_CREATE_CHANGED: 'PAYMENT_FOR_CREATE_CHANGED',
  PAYMENT_DRAFT_FOR_CREATE_CHANGED: 'PAYMENT_DRAFT_FOR_CREATE_CHANGED',
  SELECTED_PRICES_CHANGED: 'SELECTED_PRICES_CHANGED',
  PAYMENT_EDIT_STARTED: 'PAYMENT_EDIT_STARTED',
  PAYMENT_EDIT_ENDED: 'PAYMENT_EDIT_ENDED',
  PAYMENT_ADD_STARTED: 'PAYMENT_ADD_STARTED',
  PAYMENT_ADD_ENDED: 'PAYMENT_ADD_ENDED',
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

    isEditingPayment: false,
    paymentDraftForEdit: Payment.objectWithDefaults(),
    paymentForEdit: Payment.objectWithDefaults(),

    isAddingPayment: false,
    paymentDraftForCreate: Payment.objectWithDefaults(),
    paymentForCreate: Payment.objectWithDefaults(),

    selectablePrices: [],

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

    getOrder ({ state, commit, rootState }, actionPayload) {
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return OrderAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return record
      })
    },

    listPayment (context, params) {
      return PaymentAPI.queryRecord({ filter: { targetType: 'Order', targetId: params.orderId } }).then(response => {
        let apiPayload = response.data
        let payments = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return payments
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

    updateOrder ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.orderDraft) }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return OrderAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

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

    deleteOrder ({ commit }, id) {
      return OrderAPI.deleteRecord(id).then(response => {
        return response
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    setPaymentDraftForCreate ({ commit }, paymentDraft) {
      commit(MT.PAYMENT_DRAFT_FOR_CREATE_CHANGED, paymentDraft)
    },

    setPaymentForCreate ({ commit }, payment) {
      commit(MT.PAYMENT_FOR_CREATE_CHANGED, payment)
    },

    searchCustomers ({ state, commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return CustomerAPI.queryRecord(actionPayload).then(response => {
        let apiPayload = response.data
        return { meta: response.data.meta, resources: JSONAPI.deserialize(apiPayload.data, apiPayload.included) }
      }).then(response => {
        return response.resources
      })
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
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let order = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return order
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateLineItem ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.lineItemDraft) }
      let order = actionPayload.lineItemDraft.order

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return OrderLineItemAPI.updateRecord(actionPayload.id, apiPayload, options).then(() => {
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let order = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return order
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    deleteLineItem ({ state, commit }, lineItem) {
      let order = lineItem.order

      return OrderLineItemAPI.deleteRecord(lineItem.id).then(() => {
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let order = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return order
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createPayment ({ commit }, paymentDraft) {
      let apiPayload = { data: JSONAPI.serialize(paymentDraft) }
      let target = paymentDraft.target

      return PaymentAPI.createRecord(apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).then(response => {
        return OrderAPI.getRecord(target.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let order = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return order
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updatePayment ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.paymentDraft) }
      let order = actionPayload.paymentDraft.target
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return PaymentAPI.updateRecord(actionPayload.id, apiPayload, options).then(() => {
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let order = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return order
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createRefund ({ state, commit }, refundDraft) {
      let apiPayload = { data: JSONAPI.serialize(refundDraft) }
      let target = refundDraft.target

      return RefundAPI.createRecord(refundDraft.payment.id, apiPayload).then(() => {
        return OrderAPI.getRecord(target.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let order = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return order
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

    deletePayment ({ state, commit }, payment) {
      let order = payment.target

      return PaymentAPI.deleteRecord(payment.id).then(() => {
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let order = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return order
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    startAddPayment ({ commit }, paymentDraft) {
      commit(MT.PAYMENT_ADD_STARTED, paymentDraft)
    },

    endAddPayment ({ commit }, payment) {
      commit(MT.PAYMENT_ADD_ENDED)
    },

    startEditPayment ({ commit }, payment) {
      commit(MT.PAYMENT_EDIT_STARTED, payment)
    },

    endEditPayment ({ commit }) {
      commit(MT.PAYMENT_EDIT_ENDED)
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

    [MT.SELECTED_PRICES_CHANGED] (state, prices) {
      state.selectablePrices = prices
    },

    [MT.PAYMENT_EDIT_STARTED] (state, payment) {
      state.paymentDraftForEdit = payment
      state.paymentForEdit = payment
      state.isEditingPayment = true
    },

    [MT.PAYMENT_EDIT_ENDED] (state, lineItem) {
      state.isEditingPayment = false
    },

    [MT.REFUND_ADD_STARTED] (state, refundDraft) {
      state.refundDraftForCreate = refundDraft
      state.isAddingRefund = true
    },

    [MT.REFUND_ADD_ENDED] (state) {
      state.isAddingRefund = false
    },

    [MT.PAYMENT_DRAFT_FOR_CREATE_CHANGED] (state, paymentDraft) {
      state.paymentDraftForCreate = paymentDraft
    },

    [MT.PAYMENT_FOR_CREATE_CHANGED] (state, payment) {
      state.paymentForCreate = payment
      state.paymentDraftForCreate = payment
    },

    [MT.PAYMENT_ADD_STARTED] (state, paymentDraft) {
      if (paymentDraft) {
        state.paymentDraftForCreate = paymentDraft
      }
      state.isAddingPayment = true
    },

    [MT.PAYMENT_ADD_ENDED] (state) {
      state.paymentDraftForCreate = Payment.objectWithDefaults()
      state.isAddingPayment = false
    }
  }
}
