import _ from 'lodash'

import PriceAPI from '@/api/price'
import JSONAPI from '@/jsonapi'

import Price from '@/models/price'

const MT = {
  SET_RECORD: 'SET_RECORD',
  SET_RECORD_DRAFT: 'SET_RECORD_DRAFT',
  RESET_RECORD: 'RESET_RECORD',
  SET_RECORDS: 'SET_RECORDS'
}

export default {
  namespaced: true,
  state: {
    record: Price.objectWithDefaults(),
    recordDraft: Price.objectWithDefaults(),
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
      return PriceAPI.getRecord(actionPayload.id, options).then(response => {
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
      return PriceAPI.createRecord(recordDraft.productItem.id, apiPayload).then(response => {
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
      return PriceAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    deleteRecord ({ commit }, id) {
      return PriceAPI.deleteRecord(id).then(response => {
        commit(MT.RESET_RECORD)

        return response
      })
    }
  },

  mutations: {
    [MT.RESET_RECORD] (state) {
      state.record = Price.objectWithDefaults()
      state.recordDraft = Price.objectWithDefaults()
    },

    [MT.SET_RECORD] (state, record) {
      state.record = record
      state.recordDraft = record
    },

    [MT.SET_RECORD_DRAFT] (state, recordDraft) {
      state.recordDraft = recordDraft
    }
  }
}
