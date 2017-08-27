import axios from './jsonapi-axios'

export default {
  getRecord (id = null, options = {}) {
    if (id) {
      return axios.get(`/accounts/${id}`)
    }

    return axios.get('/account')
  }
}
