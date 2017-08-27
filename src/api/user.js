import axios from './jsonapi-axios'

export default {
  getRecord (id = null, options = {}) {
    if (id) {
      return axios.get(`/users/${id}`)
    }

    return axios.get('/user')
  }
}
