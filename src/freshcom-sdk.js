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
    this.http.defaults.params['locale'] = locale
  },

  setAccessToken (accessToken) {
    // Create a new header object to avoid changing
    // global config. Workaround of
    // https://github.com/axios/axios/issues/385
    const defaultHeaders = JSON.parse(JSON.stringify(this.http.defaults.headers))
    defaultHeaders.common['Authorization'] = `Bearer ${accessToken}`
    this.http.defaults.headers = defaultHeaders
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

  //
  // Product
  //
  listProduct (id, params = {}, options = {}) {
    return this.http.get('/products', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  createProduct (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/products', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrieveProduct (id, params = {}, options = {}) {
    return this.http.get(`/products/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  updateProduct (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/products/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  deleteProduct (id, params = {}, options = {}) {
    return this.http.delete(`/products/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  //
  // Price
  //
  listPrice (id, params = {}, options = {}) {
    return this.http.get('/prices', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  createPrice (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/prices', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrievePrice (id, params = {}, options = {}) {
    return this.http.get(`/prices/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  updatePrice (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/prices/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  deletePrice (id, params = {}, options = {}) {
    return this.http.delete(`/prices/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  //
  // Stockable
  //
  listStockable (id, params = {}, options = {}) {
    return this.http.get('/stockables', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  createStockable (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/stockables', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrieveStockable (id, params = {}, options = {}) {
    return this.http.get(`/stockables/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  updateStockable (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/stockables/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  deleteStockable (id, params = {}, options = {}) {
    return this.http.delete(`/stockables/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  //
  // Unlockable
  //
  listUnlockable (id, params = {}, options = {}) {
    return this.http.get('/unlockables', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  createUnlockable (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/unlockables', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrieveUnlockable (id, params = {}, options = {}) {
    return this.http.get(`/unlockables/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  updateUnlockable (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/unlockables/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  deleteUnlockable (id, params = {}, options = {}) {
    return this.http.delete(`/unlockables/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  //
  // Depositable
  //
  listDepositable (id, params = {}, options = {}) {
    return this.http.get('/depositables', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  createDepositable (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/depositables', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrieveDepositable (id, params = {}, options = {}) {
    return this.http.get(`/depositables/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  updateDepositable (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/depositables/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  deleteDepositable (id, params = {}, options = {}) {
    return this.http.delete(`/depositables/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  //
  // ExternalFile
  //
  listExternalFile (params = {}, options = {}) {
    return this.http.get('/external_files', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  createExternalFile (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/external_files', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrieveExternalFile (id, params = {}, options = {}) {
    return this.http.get(`/external_files/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  updateExternalFile (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/external_files/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  uploadExternalFile (fields, params = {}, options = {}) {
    let file = fields.file
    return this.createExternalFile(fields, params, options).then(response => {
      let externalFile = response.data

      if (options.created) {
        options.created(response)
      }

      let config = {
        onUploadProgress: function (progressEvent) {
          let percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)

          if (options.progress) {
            options.progress(percentage, externalFile)
          }
        },
        headers: { 'Content-Type': externalFile.contentType }
      }

      return axios.put(externalFile.url, file, config).then(() => { return response })
    }).then(response => {
      let externalFile = response.data
      externalFile.status = 'uploaded'
      return this.updateExternalFile(externalFile.id, externalFile, params, options)
    })
  },

  deleteExternalFile (id, params = {}, options = {}) {
    return this.http.delete(`/external_files/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  //
  // ExternalFileCollection
  //
  listExternalFileCollection (params = {}, options = {}) {
    return this.http.get('/external_file_collections', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  createExternalFileCollection (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/external_file_collections', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  retrieveExternalFileCollection (id, params = {}, options = {}) {
    return this.http.get(`/external_file_collections/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  updateExternalFileCollection (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/external_file_collections/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  },

  deleteExternalFileCollection (id, params = {}, options = {}) {
    return this.http.delete(`/external_file_collections/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(error => {
      throw SimpleJAS.deserializeErrors(error.response.data.errors)
    })
  }
}
