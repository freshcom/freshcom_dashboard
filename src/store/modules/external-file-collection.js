import _ from 'lodash'

import ExternalFileCollectionAPI from '@/api/external-file-collection'
import JSONAPI from '@/jsonapi'

import ExternalFileCollection from '@/models/external-file-collection'

const MT = {
  SET_RECORD: 'SET_RECORD',
  SET_RECORD_DRAFT: 'SET_RECORD_DRAFT',
  RESET_RECORD: 'RESET_RECORD',
  SET_RECORDS: 'SET_RECORDS'
}

export const Store = {
  namespaced: true,
  state: {
    record: {},
    recordDraft: {},
    records: []
  },
  actions: {
    setRecord({ commit }, record) {
      commit(MT.SET_RECORD, record)
    },

    setRecordDraft({ commit }, record) {
      commit(MT.SET_RECORD_DRAFT, record)
    },

    resetRecord({ commit }) {
      commit(MT.RESET_RECORD)
    },

    loadRecord({ state, commit, rootState }, actionPayload) {
      if (state.record && state.record.id === actionPayload.id && state.record.locale === rootState.resourceLocale) {
        return new Promise((resolve, reject) => {
          resolve(state.record)
        })
      }

      if (state.record.id !== actionPayload.id) {
        commit(MT.RESET_RECORD)
      }

      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return ExternalFileCollectionAPI.getRecord(actionPayload.id, actionPayload).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createRecord(context, recordDraft) {
      console.log(recordDraft)
      let apiPayload = { data: JSONAPI.serialize(recordDraft) }
      console.log(apiPayload)
      return ExternalFileCollectionAPI.createRecord(apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).then(record => {
        context.commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateRecord({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.recordDraft) }

      return ExternalFileCollectionAPI.updateRecord(actionPayload.id, apiPayload, rootState.resourceLocale).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).then(record => {
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    loadRecords({ state, commit }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: state.resourceLocale })

      return ExternalFileCollectionAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.SET_RECORDS, response.resources)

        return response
      })
    },

    deleteRecord({ commit }, id) {
      return ExternalFileCollectionAPI.deleteRecord(id).then(response => {
        commit(MT.RESET_RECORD)

        return response
      })
    }
  },

  mutations: {
    [MT.RESET_RECORD](state) {
      state.record = ExternalFileCollection.objectWithDefaults()
      state.recordDraft = ExternalFileCollection.objectWithDefaults()
    },

    [MT.SET_RECORD](state, record) {
      state.record = record
      state.recordDraft = record
    },

    [MT.SET_RECORD_DRAFT](state, recordDraft) {
      state.recordDraft = recordDraft
    },

    [MT.SET_RECORDS](state, records) {
      state.records = records
    }
  }
}
