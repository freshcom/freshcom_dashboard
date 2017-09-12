import axios from './jsonapi-axios'

export default {
  createRecord (productId, payload, params = {}) {
    return axios.post(`/products/${productId}/items`, payload)
  },

  updateRecord (id, payload, options) {
    let params = {}

    let include = options.include
    if (include) {
      params.include = include
    }

    let locale = options.locale
    if (locale) {
      params.locale = locale
    }

    return axios.patch(`/product_items/${id}`, payload, { params: params })
  },

  queryRecord (options = {}) {
    let params = {}

    if (options.search) {
      params.search = options.search
    }

    let page = options.page
    if (page) {
      params.page = page
    }

    let fields = options.fields
    if (fields) {
      params.fields = fields
    }

    let locale = options.locale
    if (locale) {
      params.locale = locale
    }

    let filter = options.filter
    if (filter) {
      params.filter = filter
    }

    let include = options.include
    if (include) {
      params.include = include
    }

    return axios.get('/product_items', {
      params: params
    })
  },

  getRecord (id, options = {}) {
    let params = {}

    let fields = options.fields
    if (fields) {
      params.fields = fields
    }

    let include = options.include
    if (include) {
      params.include = include
    }

    let locale = options.locale
    if (locale) {
      params.locale = locale
    }

    return axios.get(`/product_items/${id}`, { params: params })
  },

  deleteRecord (id) {
    return axios.delete(`/product_items/${id}`)
  }

}
