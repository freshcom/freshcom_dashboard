import axios from './jsonapi-axios'

export default {
  getRecord (id = null, options = {}) {
    if (id) {
      return axios.get(`/accounts/${id}`)
    }

    return axios.get('/account')
  },

  updateRecord (payload, options) {
    let params = {}

    let include = options.include
    if (include) {
      params.include = include
    }

    return axios.patch(`/account`, payload, { params: params })
  }
}
