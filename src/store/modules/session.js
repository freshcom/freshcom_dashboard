import SessionAPI from '@/api/session'
import UserAPI from '@/api/user'
import AccountAPI from '@/api/account'
import JSONAPI from '@/jsonapi'

const MT = {
  SET_RECORD: 'SET_RECORD',
  SET_USER: 'SET_USER',
  SET_ACCOUNT: 'SET_ACCOUNT'
}

export default {
  namespaced: true,
  state: {
    record: undefined,
    user: undefined,
    account: undefined
  },
  actions: {
    loadRecord ({ commit, dispatch }) {
      let rawRecord = localStorage.getItem('state.session.record')
      if (!rawRecord) {
        return Promise.reject()
      }

      let record = JSON.parse(rawRecord)
      let payload = { refresh_token: record.refresh_token, grant_type: 'refresh_token' }

      return SessionAPI.createRecord(payload).then(response => {
        let record = response.data
        localStorage.setItem('state.session.record', JSON.stringify(record))
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        localStorage.removeItem('state.session.record')
        throw error.response.data
      }).then(() => {
        return Promise.all([dispatch('loadUser'), dispatch('loadAccount')])
      })
    },

    createRecord ({ commit, dispatch }, form) {
      let payload = { username: form.username, password: form.password, scope: 'type:user', grant_type: 'password' }

      return SessionAPI.createRecord(payload).then(response => {
        let record = response.data
        if (form.rememberMe) {
          localStorage.setItem('state.session.record', JSON.stringify(record))
        }
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw error.response.data
      }).then(() => {
        return Promise.all([dispatch('loadUser'), dispatch('loadAccount')])
      })
    },

    loadUser ({ state, commit }) {
      if (!state.record) { return }

      return UserAPI.getRecord().then(response => {
        let apiPayload = response.data
        let user = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.SET_USER, user)

        return user
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    loadAccount ({ state, commit }) {
      if (!state.record) { return }

      return AccountAPI.getRecord().then(response => {
        let apiPayload = response.data
        let account = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.SET_ACCOUNT, account)

        return account
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    }
  },

  mutations: {
    [MT.SET_RECORD] (state, record) {
      state.record = record
    },
    [MT.SET_USER] (state, user) {
      state.user = user
    },
    [MT.SET_ACCOUNT] (state, account) {
      state.account = account
    }
  }
}
