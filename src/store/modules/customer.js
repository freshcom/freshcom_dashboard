import _ from 'lodash'

import CustomerAPI from '@/api/customer'
import DataImportAPI from '@/api/data-import'
import CardAPI from '@/api/card'
import JSONAPI from '@/jsonapi'

import Customer from '@/models/customer'

const MT = {
  SET_RECORD: 'SET_RECORD',
  SET_RECORD_DRAFT: 'SET_RECORD_DRAFT',
  RESET_RECORD: 'RESET_RECORD',
  SET_RECORDS: 'SET_RECORDS'
}

export default {
  namespaced: true,
  state: {
    record: Customer.objectWithDefaults(),
    recordDraft: Customer.objectWithDefaults(),
    records: []
  },
  actions: {
    setRecordDraft ({ commit }, record) {
      commit(MT.SET_RECORD_DRAFT, record)
    },

    resetRecord ({ commit }) {
      commit(MT.RESET_RECORD)
    },

    getCustomer ({ state, commit, rootState }, actionPayload) {
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return CustomerAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let customer = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return customer
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createCustomer (context, recordDraft) {
      let apiPayload = { data: JSONAPI.serialize(recordDraft) }
      return CustomerAPI.createRecord(apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateCustomer ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.customerDraft) }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return CustomerAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let customer = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return customer
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    listCustomer ({ state, commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return CustomerAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, customers: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        return response
      })
    },

    deleteCustomer ({ commit }, id) {
      return CustomerAPI.deleteRecord(id).then(response => {
        return response
      })
    },

    listCard ({ commit }, params) {
      return CardAPI.queryRecord({ filter: { ownerType: 'Customer', ownerId: params.customerId } }).then(response => {
        let apiPayload = response.data
        let payments = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return payments
      })
    },

    updateCard ({ commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.cardDraft) }
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return CardAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let card = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return card
      })
    },

    deleteCard ({ commit }, id) {
      return CardAPI.deleteRecord(id)
    },

    createDataImport (context, recordDraft) {
      let apiPayload = { data: JSONAPI.serialize(recordDraft) }
      return DataImportAPI.createRecord(apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    }
  },

  mutations: {
    [MT.RESET_RECORD] (state) {
      state.record = Customer.objectWithDefaults()
      state.recordDraft = Customer.objectWithDefaults()
    },

    [MT.SET_RECORD] (state, record) {
      state.record = record
      state.recordDraft = record
    },

    [MT.SET_RECORD_DRAFT] (state, recordDraft) {
      state.recordDraft = recordDraft
    },

    [MT.SET_RECORDS] (state, records) {
      state.records = records
    }
  }
}
