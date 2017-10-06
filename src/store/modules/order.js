import _ from 'lodash'

import OrderLineItemAPI from '@/api/order-line-item'
import OrderAPI from '@/api/order'
import JSONAPI from '@/jsonapi'

import Order from '@/models/order'

const MT = {
  SET_RECORD: 'SET_RECORD',
  SET_RECORD_DRAFT: 'SET_RECORD_DRAFT',
  RESET_RECORD: 'RESET_RECORD',
  SET_RECORDS: 'SET_RECORDS'
}

export default {
  namespaced: true,
  state: {
    record: Order.objectWithDefaults(),
    recordDraft: Order.objectWithDefaults(),
    records: []
  },
  actions: {
    setRecord ({ commit }, record) {
      commit(MT.SET_RECORD, record)
    },

    setRecordDraft ({ commit }, record) {
      commit(MT.SET_RECORD_DRAFT, record)
    },

    resetRecord ({ commit }) {
      commit(MT.RESET_RECORD)
    },

    loadRecord ({ state, commit, rootState }, actionPayload) {
      if (state.record && state.record.id === actionPayload.id && state.record.locale === rootState.resourceLocale) {
        return new Promise((resolve, reject) => {
          resolve(state.record)
        })
      }

      if (state.record.id !== actionPayload.id) {
        commit(MT.RESET_RECORD)
      }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return OrderAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.SET_RECORD, record)

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
        context.commit(MT.SET_RECORD, record)

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
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    loadRecords ({ state, commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return OrderAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.SET_RECORDS, response.resources)

        return response
      })
    },

    deleteRecord ({ commit }, id) {
      return OrderAPI.deleteRecord(id).then(response => {
        commit(MT.RESET_RECORD)

        return response
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

      orderCreated.then(order => {
        let apiPayload = { data: JSONAPI.serialize(lineItemDraft) }
        return Promise.all([OrderLineItemAPI.createRecord(order.id, apiPayload), order])
      }).then(responses => {
        let order = responses[1]
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },
    deleteLineItem ({ state, commit }, lineItem) {
      let order = lineItem.order

      OrderLineItemAPI.deleteRecord(lineItem.id).then(() => {
        return OrderAPI.getRecord(order.id, { include: 'rootLineItems.children' })
      }).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    }
  },

  mutations: {
    [MT.RESET_RECORD] (state) {
      state.record = Order.objectWithDefaults()
      state.recordDraft = Order.objectWithDefaults()
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
