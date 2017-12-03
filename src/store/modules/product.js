import _ from 'lodash'

import ProductAPI from '@/api/product'
import StockableAPI from '@/api/stockable'
import UnlockableAPI from '@/api/unlockable'
import JSONAPI from '@/jsonapi'

import Product from '@/models/product'

const MT = {
  RECORD_CHANGED: 'RECORD_CHANGED',
  RECORD_DRAFT_CHANGED: 'RECORD_DRAFT_CHANGED',
  RECORD_RESET: 'RECORD_RESET',
  RECORDS_CHANGED: 'RECORDS_CHANGED',
  RECORDS_LOADING: 'RECORDS_LOADING',

  SELECTABLE_StockableS_CHANGED: 'SELECTABLE_StockableS_CHANGED',
  SELECTABLE_StockableS_LOADING: 'SELECTABLE_StockableS_LOADING',
  SELECTABLE_StockableS_RESET: 'SELECTABLE_StockableS_RESET',
  SELECTABLE_UNLOCKABLES_CHANGED: 'SELECTABLE_UNLOCKABLES_CHANGED',
  SELECTABLE_UNLOCKABLES_LOADING: 'SELECTABLE_UNLOCKABLES_LOADING',
  SELECTABLE_UNLOCKABLES_RESET: 'SELECTABLE_UNLOCKABLES_RESET'
}

export default {
  namespaced: true,
  state: {
    record: Product.objectWithDefaults(),
    recordDraft: Product.objectWithDefaults(),
    records: [],
    isLoadingRecords: true,

    selectableStockables: [],
    isLoadingSelectableStockables: false,
    selectableUnlockables: [],
    isLoadingSelectableUnlockables: false
  },
  actions: {
    loadSelectableStockables ({ state, commit, rootState }, actionPayload) {
      commit(MT.SELECTABLE_StockableS_LOADING)
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return StockableAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.SELECTABLE_StockableS_CHANGED, response.resources)

        return response
      })
    },

    resetSelectableStockables ({ commit }) {
      commit(MT.SELECTABLE_StockableS_RESET)
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

    setRecord ({ commit }, record) {
      commit(MT.RECORD_CHANGED, record)
    },

    setRecordDraft ({ commit }, record) {
      commit(MT.RECORD_DRAFT_CHANGED, record)
    },

    resetRecord ({ commit }) {
      commit(MT.RECORD_RESET)
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
      return ProductAPI.getRecord(actionPayload.id, options).then(response => {
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
      return ProductAPI.createRecord(apiPayload).then(response => {
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
      return ProductAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    updateVariant ({ state, commit, rootState }, actionPayload) {
      let apiPayload = { data: JSONAPI.serialize(actionPayload.recordDraft) }

      let options = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return ProductAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
        let apiPayload = response.data
        let updatedVariant = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        let record = _.cloneDeep(state.record)
        _.each(record.variants, (variant) => {
          if (actionPayload.recordDraft.primary) {
            variant.primary = false
          }

          if (variant.id === updatedVariant.id) {
            variant.status = updatedVariant.status
            variant.primary = updatedVariant.primary
          }
        })

        commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    loadRecords ({ state, commit, rootState }, actionPayload) {
      commit(MT.RECORDS_LOADING)
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return ProductAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.RECORDS_CHANGED, response.resources)

        return response
      })
    },

    deleteRecord ({ commit }, id) {
      return ProductAPI.deleteRecord(id).then(response => {
        commit(MT.RECORD_RESET)

        return response
      })
    }
  },

  mutations: {
    [MT.RECORD_RESET] (state) {
      state.record = Product.objectWithDefaults()
      state.recordDraft = Product.objectWithDefaults()
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

    [MT.SELECTABLE_StockableS_CHANGED] (state, stockables) {
      state.selectableStockables = stockables
      state.isLoadingSelectableStockables = false
    },

    [MT.SELECTABLE_StockableS_LOADING] (state) {
      state.isLoadingSelectableStockables = true
    },

    [MT.SELECTABLE_StockableS_RESET] (state) {
      state.isLoadingSelectableStockables = true
      state.selectableStockables = []
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
