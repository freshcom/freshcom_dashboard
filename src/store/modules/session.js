import freshcom from '@/freshcom-sdk'

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
    getToken ({ commit, dispatch }) {
      let rawRecord = localStorage.getItem('state.session.token')
      if (!rawRecord) {
        commit(MT.READY, true)
        return Promise.reject(new Error('no token'))
      }

      let token = JSON.parse(rawRecord)
      let payload = { refresh_token: token.refresh_token, grant_type: 'refresh_token' }

      return freshcom.createToken(payload).then(token => {
        localStorage.setItem('state.session.token', JSON.stringify(token))
        commit(MT.TOKEN_CHANGED, token)

        return token
      }).catch(error => {
        localStorage.removeItem('state.session.token')
        throw error.response.data
      }).then(() => {
        return Promise.all([dispatch('getAccount'), dispatch('getUser')])
      }).then((resolved) => {
        commit(MT.READY, true)
        return resolved
      })
    },

    login ({ state, commit, dispatch }, form) {
      let payload = {
        username: form.username,
        password: form.password,
        grant_type: 'password'
      }

      return freshcom.createToken(payload).then(token => {
        localStorage.setItem('state.session.token', JSON.stringify(token))
        commit(MT.TOKEN_CHANGED, token)

        return Promise.all([dispatch('getAccount'), dispatch('getUser')])
      }).then(resolved => {
        commit(MT.ACCOUNT_CHANGED, resolved[0])
        commit(MT.USER_CHANGED, resolved[1])
        commit(MT.READY, true)

        return resolved
      })
    },

    getUser ({ state, commit }) {
      if (!state.token) { return }

      return freshcom.retrieveUser().then(response => {
        let user = response.data
        commit(MT.USER_CHANGED, user)

        return user
      })
    },

    getAccount ({ state, commit, dispatch }) {
      return freshcom.retrieveAccount().then(response => {
        let account = response.data
        commit(MT.ACCOUNT_CHANGED, account)
        dispatch('setResourceLocale', account.defaultLocale, { root: true })

        return account
      })
    }
  },

  mutations: {
    [MT.TOKEN_CHANGED] (state, token) {
      state.token = token
      freshcom.setAccessToken(token.access_token)
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
