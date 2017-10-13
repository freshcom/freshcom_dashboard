import _ from 'lodash'

import ProductItemAPI from '@/api/product-item'
import SkuAPI from '@/api/sku'
import UnlockableAPI from '@/api/unlockable'
import JSONAPI from '@/jsonapi'

import ProductItem from '@/models/product-item'

const MT = {
  RECORD_CHANGED: 'RECORD_CHANGED',
  RECORD_DRAFT_CHANGED: 'RECORD_DRAFT_CHANGED',
  RECORD_RESET: 'RECORD_RESET',
  RECORDS_CHANGED: 'RECORDS_CHANGED',
  RECORDS_LOADING: 'RECORDS_LOADING',
  SELECTABLE_SKUS_CHANGED: 'SELECTABLE_SKUS_CHANGED',
  SELECTABLE_SKUS_LOADING: 'SELECTABLE_SKUS_LOADING',
  SELECTABLE_SKUS_RESET: 'SELECTABLE_SKUS_RESET',
  SELECTABLE_UNLOCKABLES_CHANGED: 'SELECTABLE_UNLOCKABLES_CHANGED',
  SELECTABLE_UNLOCKABLES_LOADING: 'SELECTABLE_UNLOCKABLES_LOADING',
  SELECTABLE_UNLOCKABLES_RESET: 'SELECTABLE_UNLOCKABLES_RESET'
}

export default {
  namespaced: true,
  state: {
    record: ProductItem.objectWithDefaults(),
    recordDraft: ProductItem.objectWithDefaults(),
    records: [],
    isLoadingRecords: true,
    selectableSkus: [],
    isLoadingSelectableSkus: true,
    selectableUnlockables: [],
    isLoadingSelectableUnlockables: true
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

    loadSelectableSkus ({ state, commit, rootState }, actionPayload) {
      commit(MT.SELECTABLE_SKUS_LOADING)
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return SkuAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.SELECTABLE_SKUS_CHANGED, response.resources)

        return response
      })
    },

    resetSelectableSkus ({ commit }) {
      commit(MT.SELECTABLE_SKUS_RESET)
    },

    loadSelectableUnlockables ({ state, commit, rootState }, actionPayload) {
      commit(MT.SELECTABLE_UNLOCKABLES_LOADING)
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return UnlockableAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.SELECTABLE_UNLOCKABLES_CHANGED, response.resources)

        return response
      })
    },

    resetSelectableUnlockables ({ commit }) {
      commit(MT.SELECTABLE_UNLOCKABLES_RESET)
    },

    loadRecord ({ state, commit, rootState }, actionPayload) {
      if (state.record && state.record.id === actionPayload.id && state.record.locale === rootState.resourceLocale) {
        return new Promise((resolve, reject) => {
          resolve(state.record)
        })
      }

      if (state.record.id !== actionPayload.id) {
        commit(MT.RECORD_RESET)
      }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return ProductItemAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createRecord (context, recordDraft) {
      let apiPayload = { data: JSONAPI.serialize(recordDraft) }
      return ProductItemAPI.createRecord(recordDraft.product.id, apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).then(record => {
        context.commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateRecord ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.recordDraft) }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return ProductItemAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    loadRecords ({ state, commit, rootState }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return ProductItemAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.RECORDS_CHANGED, response.resources)

        return response
      })
    },

    deleteRecord ({ commit }, id) {
      return ProductItemAPI.deleteRecord(id).then(response => {
        commit(MT.RECORD_RESET)

        return response
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    }
  },

  mutations: {
    [MT.RECORD_RESET] (state) {
      state.record = ProductItem.objectWithDefaults()
      state.recordDraft = ProductItem.objectWithDefaults()
    },

    [MT.RECORD_CHANGED] (state, record) {
      state.record = record
      state.recordDraft = record
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

    [MT.SELECTABLE_SKUS_CHANGED] (state, skus) {
      state.selectableSkus = skus
      state.isLoadingSelectableSkus = false
    },

    [MT.SELECTABLE_SKUS_LOADING] (state) {
      state.isLoadingSelectableSkus = true
    },

    [MT.SELECTABLE_SKUS_RESET] (state) {
      state.isLoadingSelectableSkus = true
      state.selectableSkus = []
    },

    [MT.SELECTABLE_UNLOCKABLES_CHANGED] (state, unlockables) {
      state.selectableUnlockables = unlockables
      state.isLoadingSelectableUnlockables = false
    },

    [MT.SELECTABLE_UNLOCKABLES_LOADING] (state) {
      state.isLoadingSelectableUnlockables = true
    },

    [MT.SELECTABLE_UNLOCKABLES_RESET] (state) {
      state.isLoadingSelectableUnlockables = true
      state.selectableUnlockables = []
    }
  }
}
