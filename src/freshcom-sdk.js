import qs from 'qs'
import axios from 'axios'
import SimpleJAS from 'simple-jas'
import { API_ROOT_URL, API_CLIENT_ID, DEFAULT_LOCALE } from '@/env'

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

const sdk = {
  http: axiosInstance,
  refreshToken: undefined,

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

  _merge (dst, src1, src2) {
    for (let prop in src1) {
      if (src1.hasOwnProperty(prop)) {
        dst[prop] = src1[prop]
      }
    }

    for (let prop in src2) {
      if (src2.hasOwnProperty(prop)) {
        dst[prop] = src2[prop]
      }
    }

    return dst
  },

  setLocale (locale) {
    this.http.defaults.params['locale'] = locale
  },

  setRefreshToken (refreshToken) {
    this.refreshToken = refreshToken
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
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (payload.otp) {
      headers['X-Freshcom-OTP'] = payload.otp
    }

    return this.http.post('/token', qs.stringify(payload), { headers: headers }).then(response => {
      return response.data
    }).catch(error => {
      if (error.response && error.response.data) {
        throw error.response.data
      }

      throw error
    })
  },

  createAccountReset (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/account_resets', payload, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
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

  //
  // MARK: Phone Verification Code
  //
  createPhoneVerificationCode (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/phone_verification_codes', payload, { params: params }).then(response => {
      return {}
    }).catch(this._processHttpError)
  },

  //
  // MARK: Password
  //
  resetPassword (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/password`, payload, { params: params }).then(response => {
      return {}
    }).catch(this._processHttpError)
  },

  updatePassword (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/passwords/${id}`, payload, { params: params }).then(response => {
      return {}
    }).catch(this._processHttpError)
  },

  //
  // MARK: Email Verification
  //
  createEmailVerification (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post(`/email_verifications`, payload, { params: params }).then(response => {
      return {}
    }).catch(this._processHttpError)
  },

  //
  // MARK: Email Verification Token
  //
  createEmailVerificationToken (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post(`/email_verification_tokens`, payload, { params: params }).then(response => {
      return {}
    }).catch(this._processHttpError)
  },

  //
  // MARK: User
  //
  listUser (params = {}, options = {}) {
    return this.http.get('/users', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveCurrentUser (params = {}, options = {}) {
    return this.http.get('/user', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveUser (id, params = {}, options = {}) {
    return this.http.get(`/users/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createUser (fields = {}, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/users', payload, { params: params }).then(response => {
      if (response.status === 201) {
        return SimpleJAS.deserialize(response.data)
      }

      return response.data
    }).catch(this._processHttpError)
  },

  updateUser (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/users/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  changeUserRole (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.put(`/users/${id}/role`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  changePasswordById (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.put(`/password?id=${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteUser (id, params = {}, options = {}) {
    return this.http.delete(`/users/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // MARK: App
  //
  listApp (params = {}, options = {}) {
    return this.http.get('/apps', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  addApp (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/apps', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // MARK: Account
  //
  updateCurrentAccount (fields = {}, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch('/account', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // Data Import
  //
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

  createRefund (fields, params = {}, options = {}) {
    fields = this._merge({}, fields, { type: 'Refund' })

    let payload = SimpleJAS.serialize(fields)
    let paymentId = fields.payment.id
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
    let payload = SimpleJAS.serialize(this._merge({}, fields, { type: 'BalanceSettings' }))
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

  deleteProductCollection (id, params = {}, options = {}) {
    return this.http.delete(`/product_collections/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
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
  listPrice (productId, params = {}, options = {}) {
    return this.http.get(`/products/${productId}/prices`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createPrice (productId, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post(`/products/${productId}/prices`, payload, { params: params }).then(response => {
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
  listStockable (params = {}, options = {}) {
    return this.http.get('/stockables', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createStockable (fields, params = {}, options = {}) {
    fields = this._merge({}, fields, { type: 'Stockable' })

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
  // File
  //
  listFile (params = {}, options = {}) {
    return this.http.get('/files', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createFile (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/files', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveFile (id, params = {}, options = {}) {
    return this.http.get(`/files/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateFile (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/files/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  uploadFile (fields, params = {}, options = {}) {
    let file = fields.file
    return this.createFile(fields, params, options).then(response => {
      let fFile = response.data

      if (options.created) {
        options.created(response)
      }

      let config = {
        onUploadProgress: function (progressEvent) {
          let percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)

          if (options.progress) {
            options.progress(percentage, fFile)
          }
        },
        headers: {
          'Content-Type': fFile.contentType,
          'Cache-Control': 'max-age=0, s-maxage=2592000' // Allow cdn to cache for 30 days
        }
      }

      return axios.put(fFile.url, file, config).then(() => { return response })
    }).then(response => {
      let fFile = response.data
      fFile.status = 'uploaded'
      return this.updateFile(fFile.id, fFile, params, options)
    }).catch(this._processHttpError)
  },

  deleteFile (id, params = {}, options = {}) {
    return this.http.delete(`/files/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // FileCollection
  //
  listFileCollection (params = {}, options = {}) {
    return this.http.get('/file_collections', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createFileCollection (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/file_collections', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveFileCollection (id, params = {}, options = {}) {
    return this.http.get(`/file_collections/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateFileCollection (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/file_collections/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteFileCollection (id, params = {}, options = {}) {
    return this.http.delete(`/file_collections/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // MARK: File Collection Membership
  //
  createFileCollectionMembership (collectionId, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post(`/file_collections/${collectionId}/memberships`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateFileCollectionMembership (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/file_collection_memberships/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteFileCollectionMembership (id, params = {}, options = {}) {
    return this.http.delete(`/file_collection_memberships/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // MARK: Fulfillment Package
  //
  listFulfillmentPackage (params = {}, options = {}) {
    return this.http.get('/fulfillment_packages', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveFulfillmentPackage (id, params = {}, options = {}) {
    return this.http.get(`/fulfillment_packages/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteFulfillmentPackage (id, params = {}, options = {}) {
    return this.http.delete(`/fulfillment_packages/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  },

  //
  // MARK: Fulfillment Item
  //
  updateFulfillmentItem (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/fulfillment_items/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // MARK: Return Package
  //
  listReturnPackage (params = {}, options = {}) {
    return this.http.get('/return_packages', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // MARK: Return Item
  //
  createReturnItem (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/return_items', payload, { params: params }).then(response => {
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

  retrieveEmail (id, params = {}, options = {}) {
    return this.http.get(`/emails/${id}`, { params: params }).then(response => {
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
    fields = this._merge({}, fields, { type: 'EmailTemplate' })

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
    fields = this._merge({}, fields, { type: 'EmailTemplate' })

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
  // MARK: SMS
  //
  listSms (params = {}, options = {}) {
    return this.http.get('/sms', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveSms (id, params = {}, options = {}) {
    return this.http.get(`/sms/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  //
  // MARK: SMS Template
  //
  listSmsTemplate (params = {}, options = {}) {
    return this.http.get('/sms_templates', { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  createSmsTemplate (fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.post('/sms_templates', payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  retrieveSmsTemplate (id, params = {}, options = {}) {
    return this.http.get(`/sms_templates/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateSmsTemplate (id, fields, params = {}, options = {}) {
    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/sms_templates/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteSmsTemplate (id, params = {}, options = {}) {
    return this.http.delete(`/sms_templates/${id}`, { params: params }).then(response => {
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
  },

  retrieveNotificationTrigger (id, params = {}, options = {}) {
    return this.http.get(`/notification_triggers/${id}`, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  updateNotificationTrigger (id, fields, params = {}, options = {}) {
    fields = this._merge({}, fields, { type: 'NotificationTrigger' })

    let payload = SimpleJAS.serialize(fields)
    return this.http.patch(`/notification_triggers/${id}`, payload, { params: params }).then(response => {
      return SimpleJAS.deserialize(response.data)
    }).catch(this._processHttpError)
  },

  deleteNotificationTrigger (id, params = {}, options = {}) {
    return this.http.delete(`/notification_triggers/${id}`, { params: params }).then(response => {
      if (response.data) {
        return SimpleJAS.deserialize(response.data)
      }
    }).catch(this._processHttpError)
  }
}

axiosInstance.interceptors.response.use(undefined, function (error) {
  let config = error.config

  let response
  if (error && error.response) {
    response = error.response
  }

  // If we have not retried lets try refresh the token and try again
  if (response && response.status === 401 && sdk.refreshToken && !config.retried) {
    config.retried = true

    return sdk.createToken({
      refresh_token: sdk.refreshToken,
      grant_type: 'refresh_token',
      client_id: API_CLIENT_ID
    }).then(token => {
      sdk.setAccessToken(token.access_token)
      config.headers['Authorization'] = `Bearer ${token.access_token}`
      return axiosInstance(config)
    })
  }

  throw error
})

export default sdk
