import TokenAPI from '@/api/token'
import UserAPI from '@/api/user'
import AccountAPI from '@/api/account'
import JSONAPI from '@/jsonapi'

const MT = {
  TOKEN_CHANGED: 'TOKEN_CHANGED',
  USER_CHANGED: 'USER_CHANGED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
  READY: 'READY'
}

export default {
  namespaced: true,
  state: {
    ready: false,
    token: undefined,
    user: undefined,
    account: undefined
  },
  actions: {
    loadToken ({ commit, dispatch }) {
      let rawRecord = localStorage.getItem('state.session.token')
      if (!rawRecord) {
        commit(MT.READY, true)
        return Promise.reject(new Error('no token'))
      }

      let token = JSON.parse(rawRecord)
      let payload = { refresh_token: token.refresh_token, grant_type: 'refresh_token' }

      return TokenAPI.createRecord(payload).then(response => {
        let token = response.data
        localStorage.setItem('state.session.token', JSON.stringify(token))
        commit(MT.TOKEN_CHANGED, token)

        return token
      }).catch(error => {
        localStorage.removeItem('state.session.token')
        throw error.response.data
      }).then(() => {
        return Promise.all([dispatch('loadUser'), dispatch('loadAccount')])
      }).then((resolved) => {
        commit(MT.READY, true)
        return resolved
      })
    },

    createToken ({ commit, dispatch }, form) {
      let payload = { username: form.username, password: form.password, scope: 'type:user', grant_type: 'password' }

      return TokenAPI.createRecord(payload).then(response => {
        let token = response.data
        if (form.rememberMe) {
          localStorage.setItem('state.session.token', JSON.stringify(token))
        }
        commit(MT.TOKEN_CHANGED, token)

        return token
      }).catch(error => {
        throw error.response.data
      }).then(() => {
        return Promise.all([dispatch('loadUser'), dispatch('loadAccount')])
      }).then((resolved) => {
        commit(MT.READY, true)
        return resolved
      })
    },

    loadUser ({ state, commit }) {
      if (!state.token) { return }

      return UserAPI.getRecord().then(response => {
        let apiPayload = response.data
        let user = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.USER_CHANGED, user)

        return user
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    loadAccount ({ state, commit }) {
      if (!state.token) { return }

      return AccountAPI.getRecord().then(response => {
        let apiPayload = response.data
        let account = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.ACCOUNT_CHANGED, account)

        return account
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    }
  },

  mutations: {
    [MT.TOKEN_CHANGED] (state, token) {
      state.token = token
    },
    [MT.USER_CHANGED] (state, user) {
      state.user = user
    },
    [MT.ACCOUNT_CHANGED] (state, account) {
      state.account = account
    },
    [MT.READY] (state, ready) {
      state.ready = ready
    }
  }
}
