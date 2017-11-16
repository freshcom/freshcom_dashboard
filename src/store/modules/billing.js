import _ from 'lodash'

import BillingAPI from '@/api/billing'
import JSONAPI from '@/jsonapi'

export default {
  namespaced: true,
  actions: {
    getSettings ({ rootState }, actionPayload = {}) {
      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return BillingAPI.getSettings(options).then(response => {
        let apiPayload = response.data
        let settings = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return settings
      })
    },

    updateSettings ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.settingsDraft) }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return BillingAPI.updateSettings(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let settings = JSONAPI.deserialize(apiPayload.data, apiPayload.included)

        return settings
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    }
  }
}
