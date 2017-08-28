import axios from './jsonapi-axios'

export default {
  createRecord (payload) {
    return axios.post('/external_files', payload)
  },

  updateRecord (id, payload) {
    return axios.patch(`/external_files/${id}`, payload)
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

    return axios.get('/external_files', {
      params: params
    })
  },

  deleteRecord (id) {
    return axios.delete(`/external_files/${id}`)
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

    return axios.get(`/external_files/${id}`, { params: params })
  }
}
