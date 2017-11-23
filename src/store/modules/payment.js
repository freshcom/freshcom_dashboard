import _ from 'lodash'

import RefundAPI from '@/api/refund'
import PaymentAPI from '@/api/payment'
import JSONAPI from '@/jsonapi'
import CardAPI from '@/api/card'

export default {
  namespaced: true,
  actions: {
    listPayment ({ state, commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return PaymentAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, payments: JSONAPI.deserialize(response.data.data) }
      })
    },

    getPayment ({ state, commit, rootState }, actionPayload) {
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return PaymentAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let payment = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return payment
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    deletePayment ({ commit }, id) {
      return PaymentAPI.deleteRecord(id).then(response => {
        return response
      })
    },

    loadCards ({ commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return CardAPI.queryRecord(actionPayload).then(response => {
        let apiPayload = response.data
        return { meta: response.data.meta, resources: JSONAPI.deserialize(apiPayload.data, apiPayload.included) }
      }).then(response => {
        return response.resources
      })
    },

    createRefund ({ rootState }, refundDraft) {
      let apiPayload = { data: JSONAPI.serialize(refundDraft) }
      let payment = refundDraft.payment

      return RefundAPI.createRecord(refundDraft.payment.id, apiPayload).then(() => {
        let options = { locale: rootState.resourceLocale, include: 'refunds' }
        return PaymentAPI.getRecord(payment.id, options)
      }).then(response => {
        let apiPayload = response.data
        let payment = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return payment
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    }
  }
}
