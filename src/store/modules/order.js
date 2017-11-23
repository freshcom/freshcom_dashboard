import _ from 'lodash'
import JSONAPI from '@/jsonapi'

import OrderLineItemAPI from '@/api/order-line-item'
import OrderAPI from '@/api/order'
import CustomerAPI from '@/api/customer'
import PaymentAPI from '@/api/payment'
import RefundAPI from '@/api/refund'

export default {
  namespaced: true,
  actions: {
    listOrder ({ state, commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return OrderAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, orders: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        return response
      })
    },

    getOrder ({ state, commit, rootState }, actionPayload) {
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return OrderAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return record
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

    deleteOrder ({ commit }, id) {
      return OrderAPI.deleteRecord(id).then(response => {
        return response
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
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

    createLineItem ({ rootState, commit }, lineItemDraft) {
      let orderCreated = new Promise((resolve, reject) => {
        resolve(lineItemDraft.order)
      })
      if (!lineItemDraft.order.id) {
        let payload = { data: JSONAPI.serialize(lineItemDraft.order) }

        orderCreated = OrderAPI.createRecord(payload).then(response => {
          return JSONAPI.deserialize(response.data.data)
        })
      }

      return orderCreated.then(order => {
        let apiPayload = { data: JSONAPI.serialize(lineItemDraft) }
        return Promise.all([OrderLineItemAPI.createRecord(order.id, apiPayload), order])
      }).then(responses => {
        let order = responses[1]
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children,customer' })
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

    listPayment (context, params) {
      return PaymentAPI.queryRecord({ filter: { targetType: 'Order', targetId: params.orderId } }).then(response => {
        let apiPayload = response.data
        let payments = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return payments
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
    }
  }
}
