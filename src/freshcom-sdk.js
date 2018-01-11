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

  //
  // MARK: Token
  //
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

  //
  // MARK: Password Reset Token
  //
  createPasswordResetToken (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/password_reset_tokens', payload, { params: params }).then(response => {
      return {}
    }).catch(this._processHttpError)
  },

  retrieveRefreshToken (params = {}, options = {}) {
    return this.http.get('/refresh_token', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveAccount (params = {}, options = {}) {
    return this.http.get('/account', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  // MARK: User

  retrieveUser (params = {}, options = {}) {
    return this.http.get('/user', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateCurrentUser (fields = {}, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    console.log(payload)
    return this.http.patch('/user', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createDataImport (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/data_imports', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // Order
  //
  listOrder (params = {}, options = {}) {
    return this.http.get('/orders', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createOrder (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/orders', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveOrder (id, params = {}, options = {}) {
    return this.http.get(`/orders/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateOrder (id, fields = {}, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)

    return this.http.patch(`/orders/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteOrder (id, params = {}, options = {}) {
    return this.http.delete(`/orders/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // OrderLineItem
  //
  listOrderLineItem (params = {}, options = {}) {
    return this.http.get('/order_line_items', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createOrderLineItem (orderId, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post(`/orders/${orderId}/line_items`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateOrderLineItem (id, fields = {}, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)

    return this.http.patch(`/order_line_items/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteOrderLineItem (id, params = {}, options = {}) {
    return this.http.delete(`/order_line_items/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // Payment
  //
  listPayment (params = {}, options = {}) {
    return this.http.get('/payments', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createPayment (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/payments', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrievePayment (id, params = {}, options = {}) {
    return this.http.get(`/payments/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updatePayment (id, fields = {}, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)

    return this.http.patch(`/payments/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deletePayment (id, params = {}, options = {}) {
    return this.http.delete(`/payments/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // Refund
  //
  listRefund (params = {}, options = {}) {
    return this.http.get('/refunds', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createRefund (paymentId, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post(`payments/${paymentId}/refunds`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // Customer
  //
  listCustomer (params = {}, options = {}) {
    return this.http.get('/customers', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createCustomer (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/customers', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveCustomer (id, params = {}, options = {}) {
    return this.http.get(`/customers/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveCurrentCustomer (params = {}, options = {}) {
    return this.http.get('/customer', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveCustomerByCode (code, params = {}, options = {}) {
    params = Object.assign({}, params, { code: code })
    return this.http.get('/customer', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateCustomer (id, fields = {}, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)

    return this.http.patch(`/customers/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteCustomer (id, params = {}, options = {}) {
    return this.http.delete(`/customers/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // PointTransaction
  //
  createPointTransaction (pointAccountId, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post(`/point_accounts/${pointAccountId}/transactions`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  listPointTransaction (pointAccountId, params = {}, options = {}) {
    return this.http.get(`/point_accounts/${pointAccountId}/transactions`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deletePointTransaction (id, params = {}, options = {}) {
    return this.http.delete(`/point_transactions/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  // MARK: Unlock

  listUnlock (params = {}, options = {}) {
    return this.http.get('/unlocks', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createUnlock (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/unlocks', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveUnlock (id, params = {}, options = {}) {
    return this.http.get(`/unlocks/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteUnlock (id, params = {}, options = {}) {
    return this.http.delete(`/unlocks/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  // MARK: Card

  listCard (params = {}, options = {}) {
    return this.http.get('/cards', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateCard (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/cards/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteCard (id, params = {}, options = {}) {
    return this.http.delete(`/cards/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // BalanceSettings
  //
  retrieveBalanceSettings (params = {}, options = {}) {
    return this.http.get('/balance_settings', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateBalanceSettings (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch('/balance_settings', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // Product
  //
  listProduct (params = {}, options = {}) {
    return this.http.get('/products', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createProduct (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/products', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveProduct (id, params = {}, options = {}) {
    return this.http.get(`/products/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateProduct (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/products/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteProduct (id, params = {}, options = {}) {
    return this.http.delete(`/products/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // ProductCollection
  //
  listProductCollection (params = {}, options = {}) {
    return this.http.get('/product_collections', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createProductCollection (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/product_collections', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveProductCollection (id, params = {}, options = {}) {
    return this.http.get(`/product_collections/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveProductCollectionByCode (code, params = {}, options = {}) {
    params = Object.assign({}, params, { code: code })
    return this.http.get('/product_collection', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateProductCollection (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/product_collections/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // ProductCollectionMembership
  //
  listProductCollectionMembership (collectionId, params = {}, options = {}) {
    return this.http.get(`/product_collections/${collectionId}/memberships`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createProductCollectionMembership (collectionId, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post(`/product_collections/${collectionId}/memberships`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteProductCollectionMembership (id, params = {}, options = {}) {
    return this.http.delete(`/product_collection_memberships/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // Price
  //
  listPrice (id, params = {}, options = {}) {
    return this.http.get('/prices', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createPrice (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/prices', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrievePrice (id, params = {}, options = {}) {
    return this.http.get(`/prices/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updatePrice (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/prices/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deletePrice (id, params = {}, options = {}) {
    return this.http.delete(`/prices/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // Stockable
  //
  listStockable (id, params = {}, options = {}) {
    return this.http.get('/stockables', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createStockable (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/stockables', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveStockable (id, params = {}, options = {}) {
    return this.http.get(`/stockables/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateStockable (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/stockables/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteStockable (id, params = {}, options = {}) {
    return this.http.delete(`/stockables/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // Unlockable
  //
  listUnlockable (params = {}, options = {}) {
    return this.http.get('/unlockables', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createUnlockable (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/unlockables', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveUnlockable (id, params = {}, options = {}) {
    return this.http.get(`/unlockables/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateUnlockable (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/unlockables/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteUnlockable (id, params = {}, options = {}) {
    return this.http.delete(`/unlockables/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // Depositable
  //
  listDepositable (id, params = {}, options = {}) {
    return this.http.get('/depositables', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createDepositable (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/depositables', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveDepositable (id, params = {}, options = {}) {
    return this.http.get(`/depositables/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateDepositable (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/depositables/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteDepositable (id, params = {}, options = {}) {
    return this.http.delete(`/depositables/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // ExternalFile
  //
  listExternalFile (params = {}, options = {}) {
    return this.http.get('/external_files', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createExternalFile (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/external_files', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveExternalFile (id, params = {}, options = {}) {
    return this.http.get(`/external_files/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateExternalFile (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/external_files/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
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
    }).catch(this._processHttpError)
  },

  deleteExternalFile (id, params = {}, options = {}) {
    return this.http.delete(`/external_files/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // ExternalFileCollection
  //
  listExternalFileCollection (params = {}, options = {}) {
    return this.http.get('/external_file_collections', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createExternalFileCollection (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/external_file_collections', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveExternalFileCollection (id, params = {}, options = {}) {
    return this.http.get(`/external_file_collections/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateExternalFileCollection (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/external_file_collections/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteExternalFileCollection (id, params = {}, options = {}) {
    return this.http.delete(`/external_file_collections/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // MARK: Fulfillment
  //
  listFulfillment (params = {}, options = {}) {
    return this.http.get('/fulfillments', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // MARK: Fulfillment Line Item
  //
  updateFulfillmentLineItem (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/fulfillment_line_items/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // MARK: Email
  //
  listEmail (params = {}, options = {}) {
    return this.http.get('/emails', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // MARK: Email Template
  //
  listEmailTemplate (params = {}, options = {}) {
    return this.http.get('/email_templates', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createEmailTemplate (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/email_templates', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveEmailTemplate (id, params = {}, options = {}) {
    return this.http.get(`/email_templates/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateEmailTemplate (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/email_templates/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteEmailTemplate (id, params = {}, options = {}) {
    return this.http.delete(`/email_templates/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // MARK: Notification Trigger
  //
  listNotificationTrigger (params = {}, options = {}) {
    return this.http.get('/notification_triggers', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createNotificationTrigger (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/notification_triggers', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  }
}
