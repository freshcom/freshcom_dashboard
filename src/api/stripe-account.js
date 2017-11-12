import axios from './jsonapi-axios'

export default {
  createRecord (payload, params = {}) {
    return axios.post('/stripe_accounts', payload)
  }
}
