import qs from 'qs'
import axios from 'axios'
import SimpleJAS from 'simple-jas'
import { API_ROOT_URL, DEFAULT_LOCALE } from '@/env'

let axiosInstance = axios.create({
  baseURL: API_ROOT_URL,
  headers: {
    'Content-Type': 'application/vnd.api+json'
  },
  params: {
    locale: DEFAULT_LOCALE
  },
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  }
})

export default {
  http: axiosInstance,

  _processHttpError (error) {
    let response
    if (error && error.response) {
      response = error.response
    }

    if (response && response.status === 422) {
      response.errors = SimpleJAS.deserializeErrors(error.response.data.errors)
      throw response
    }

    if (response) {
      throw error.response
    }

    throw error
  },

  setLocale (locale) {
    this.http.defaults.common['locale'] = locale
  },

  setAccessToken (accessToken) {
    this.http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  },

  createToken (payload) {
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return this.http.post('/token', qs.stringify(payload), config).then(response => {
      return response.data
    }).catch(error => {
      throw error.response.data
    })
  },

  retrieveUser (params = {}, options = {}) {
    return this.http.get('/user', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrieveCustomer (id, params = {}, options = {}) {
    return this.http.get(`/customers/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrieveCustomerByCode (code, params = {}, options = {}) {
    params = Object.assign({}, params, { code: code })
    return this.http.get('/customer', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      return this._processHttpError(error)
    })
  },

  updateCustomer (id, fields = {}, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    console.log(payload)

    return this.http.patch(`/customers/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      return this._processHttpError(error)
    })
  },

  retrieveAccount (params = {}, options = {}) {
    return this.http.get('/account', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  listPointDeposit (id, params = {}, options = {}) {
    return this.http.get('/point_deposits', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  createPointDeposit (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/point_deposits', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrievePointDeposit (id, params = {}, options = {}) {
    return this.http.get(`/point_deposits/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  }
}
