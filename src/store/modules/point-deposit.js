import _ from 'lodash'

import PointDepositAPI from '@/api/point-deposit'
import JSONAPI from '@/jsonapi'

export default {
  namespaced: true,
  actions: {
    listPointDeposit ({ state, commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return PointDepositAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, pointDeposits: JSONAPI.deserialize(response.data.data) }
      })
    },

    getPointDeposit ({ state, commit, rootState }, actionPayload) {
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return PointDepositAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let pointDeposit = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return pointDeposit
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createPointDeposit (context, recordDraft) {
      let apiPayload = { data: JSONAPI.serialize(recordDraft) }
      return PointDepositAPI.createRecord(apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateRecord ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.recordDraft) }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return PointDepositAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    deleteRecord ({ commit }, id) {
      return PointDepositAPI.deleteRecord(id).then(response => {
        return response
      })
    }
  }
}
