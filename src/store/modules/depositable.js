import _ from 'lodash'

import DepositableAPI from '@/api/depositable'
import JSONAPI from '@/jsonapi'

export default {
  namespaced: true,
  actions: {
    listDepositable ({ state, commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return DepositableAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, depositables: JSONAPI.deserialize(response.data.data) }
      })
    },

    getDepositable ({ state, commit, rootState }, actionPayload) {
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return DepositableAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let depositable = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return depositable
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createDepositable (context, recordDraft) {
      let apiPayload = { data: JSONAPI.serialize(recordDraft) }
      return DepositableAPI.createRecord(apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateDepositable ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.depositableDraft) }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return DepositableAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let depositable = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return depositable
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    deleteDepositable ({ commit }, id) {
      return DepositableAPI.deleteRecord(id).then(response => {
        return response
      })
    }
  }
}
