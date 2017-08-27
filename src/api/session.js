import qs from 'qs'
import axios from './default-axios'

export default {
  createRecord (payload) {
    payload = qs.stringify(payload)
    return axios.post('/token', payload)
  }
}
