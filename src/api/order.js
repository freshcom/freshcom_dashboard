import axios from './jsonapi-axios'

export default {
  createRecord (payload, params = {}) {
    return axios.post('/orders', payload)
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

    return axios.patch(`/orders/${id}`, payload, { params: params })
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

    return axios.get('/orders', {
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

    return axios.get(`/orders/${id}`, { params: params })
  },

  deleteRecord (id) {
    return axios.delete(`/orders/${id}`)
  }

}
