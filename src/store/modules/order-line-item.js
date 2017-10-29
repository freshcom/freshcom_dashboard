import _ from 'lodash'

import OrderLineItemAPI from '@/api/order-line-item'
import ProductAPI from '@/api/product'
import ProductItemAPI from '@/api/product-item'
import JSONAPI from '@/jsonapi'

import OrderLineItem from '@/models/order-line-item'

const MT = {
  RECORD_CHANGED: 'RECORD_CHANGED',
  RECORD_DRAFT_CHANGED: 'RECORD_DRAFT_CHANGED',
  RECORD_RESET: 'RECORD_RESET',
  RECORD_LOADING: 'RECORD_LOADING',
  RECORDS_CHANGED: 'RECORDS_CHANGED',
  SELECTABLE_PRODUCTS_CHANGED: 'SELECTABLE_PRODUCTS_CHANGED',
  SELECTABLE_PRODUCTS_LOADING: 'SELECTABLE_PRODUCTS_LOADING',
  SELECTABLE_PRODUCTS_RESET: 'SELECTABLE_PRODUCTS_RESET',
  SELECTABLE_PRODUCT_ITEMS_CHANGED: 'SELECTABLE_PRODUCT_ITEMS_CHANGED',
  SELECTABLE_PRODUCT_ITEMS_LOADING: 'SELECTABLE_PRODUCT_ITEMS_LOADING',
  SELECTABLE_PRODUCT_ITEMS_RESET: 'SELECTABLE_PRODUCT_ITEMS_RESET'
}

export default {
  namespaced: true,
  state: {
    record: OrderLineItem.objectWithDefaults(),
    recordDraft: OrderLineItem.objectWithDefaults(),
    isRecordLoading: false,
    records: [],
    selectableProducts: [],
    isLoadingSelectableProducts: false,
    selectableProductItems: [],
    isLoadingSelectableProductItems: false
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

    loadSelectableProducts ({ state, commit, rootState }, actionPayload) {
      commit(MT.SELECTABLE_PRODUCTS_LOADING)
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return ProductAPI.queryRecord(actionPayload).then(response => {
        let apiPayload = response.data
        return { meta: response.data.meta, resources: JSONAPI.deserialize(apiPayload.data, apiPayload.included) }
      }).then(response => {
        commit(MT.SELECTABLE_PRODUCTS_CHANGED, response.resources)

        return response
      }).catch(error => {
        console.log(error)
      })
    },

    resetSelectableProducts ({ commit }) {
      commit(MT.SELECTABLE_PRODUCTS_RESET)
    },

    loadSelectableProductItems ({ state, commit, rootState }, actionPayload) {
      commit(MT.SELECTABLE_PRODUCT_ITEMS_LOADING)
      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })

      return ProductItemAPI.queryRecord(actionPayload).then(response => {
        let apiPayload = response.data
        return { meta: response.data.meta, resources: JSONAPI.deserialize(apiPayload.data, apiPayload.included) }
      }).then(response => {
        commit(MT.SELECTABLE_PRODUCT_ITEMS_CHANGED, response.resources)

        return response
      }).catch(error => {
        console.log(error)
      })
    },

    resetSelectableProductItems ({ commit }) {
      commit(MT.SELECTABLE_PRODUCT_ITEMS_RESET)
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
      return OrderLineItemAPI.getRecord(actionPayload.id, options).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.RECORD_CHANGED, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    createRecord (context, recordDraft) {
      context.commit(MT.RECORD_LOADING)

      let apiPayload = { data: JSONAPI.serialize(recordDraft) }
      return OrderLineItemAPI.createRecord(recordDraft.order.id, apiPayload).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data)

        return record
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
      return OrderLineItemAPI.updateRecord(actionPayload.id, apiPayload, options).then(response => {
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

      return OrderLineItemAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.RECORDS_CHANGED, response.resources)

        return response
      })
    },

    deleteRecord ({ commit }, id) {
      return OrderLineItemAPI.deleteRecord(id).then(response => {
        commit(MT.RECORD_RESET)

        return response
      })
    }
  },

  mutations: {
    [MT.RECORD_RESET] (state) {
      state.record = OrderLineItem.objectWithDefaults()
      state.recordDraft = OrderLineItem.objectWithDefaults()
    },

    [MT.RECORD_CHANGED] (state, record) {
      state.record = record
      state.isRecordLoading = false
    },

    [MT.RECORD_DRAFT_CHANGED] (state, recordDraft) {
      state.recordDraft = recordDraft
    },

    [MT.RECORDS_CHANGED] (state, records) {
      state.records = records
    },

    [MT.SELECTABLE_PRODUCTS_CHANGED] (state, products) {
      state.selectableProducts = products
      state.isLoadingSelectableProducts = false
    },

    [MT.SELECTABLE_PRODUCTS_LOADING] (state) {
      state.isLoadingSelectableProducts = true
    },

    [MT.SELECTABLE_PRODUCTS_RESET] (state) {
      state.isLoadingSelectableProducts = false
      state.selectableProducts = []
    },

    [MT.SELECTABLE_PRODUCT_ITEMS_CHANGED] (state, productItems) {
      state.selectableProductItems = productItems
      state.isLoadingSelectableProductItems = false
    },

    [MT.SELECTABLE_PRODUCT_ITEMS_LOADING] (state) {
      state.isLoadingSelectableProductItems = true
    },

    [MT.SELECTABLE_PRODUCT_ITEMS_RESET] (state) {
      state.isLoadingSelectableProductItems = false
      state.selectableProductItems = []
    },

    [MT.RECORD_LOADING] (state) {
      state.isRecordLoading = true
    }
  }
}
