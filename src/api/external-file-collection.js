import axios from './jsonapi-axios'

export default {
  createRecord (payload, params = {}) {
    return axios.post('/external_file_collections', payload)
  },

  updateRecord (id, payload, locale) {
    return axios.patch(`/external_file_collections/${id}`, payload, { params: { locale: locale } })
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

    return axios.get('/external_file_collections', {
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

    return axios.get(`/external_file_collections/${id}`, { params: params })
  },

  deleteRecord (id) {
    return axios.delete(`/external_file_collections/${id}`)
  }

}
