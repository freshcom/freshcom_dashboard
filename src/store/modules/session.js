import freshcom from '@/freshcom-sdk'

const MT = {
  TOKEN_CHANGED: 'TOKEN_CHANGED',
  USER_CHANGED: 'USER_CHANGED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
  MODE_CHANGED: 'MODE_CHANGED',
  LIVE_TOKEN_CHANGED: 'LIVE_TOKEN_CHANGED',
  LIVE_TOKEN_REFRESHER_ID_CHANGED: 'LIVE_TOKEN_REFRESHER_ID_CHANGED',
  TEST_TOKEN_REFRESHER_ID_CHANGED: 'TEST_TOKEN_REFRESHER_ID_CHANGED',
  READY: 'READY'
}

const FIFTY_MINUTES = 3000000

export default {
  namespaced: true,
  state: {
    ready: false,
    liveToken: undefined,
    token: undefined,
    user: undefined,
    account: undefined,
    mode: 'live',
    liveTokenRefresherId: undefined,
    testTokenRefresherId: undefined
  },
  actions: {
    retrieveFromStorage ({ commit, dispatch }) {
      let rawLiveToken = localStorage.getItem('state.session.liveToken')
      if (!rawLiveToken) {
        return Promise.reject(new Error('no token'))
      }

      let liveToken = JSON.parse(rawLiveToken)
      commit(MT.LIVE_TOKEN_CHANGED, liveToken)

      return dispatch('refreshLiveToken').then(() => {
        let refresherId = setInterval(() => {
          dispatch('refreshLiveToken')
        }, FIFTY_MINUTES)
        commit(MT.LIVE_TOKEN_REFRESHER_ID_CHANGED, refresherId)

        return Promise.all([dispatch('getAccount'), dispatch('getUser')])
      }).then((resolved) => {
        let mode = localStorage.getItem('state.session.mode')
        if (mode === 'test') {
          return dispatch('setMode', mode)
        }

        return resolved
      }).then(() => {
        commit(MT.READY, true)
      }).catch(error => {
        dispatch('reset')
        throw error.response.data
      })
    },

    create ({ state, commit, dispatch }, form) {
      let payload = {
        username: form.username,
        password: form.password,
        grant_type: 'password'
      }

      return freshcom.createToken(payload).then(token => {
        localStorage.setItem('state.session.liveToken', JSON.stringify(token))
        commit(MT.LIVE_TOKEN_CHANGED, token)
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'live')

        let refresherId = setInterval(() => {
          dispatch('refreshLiveToken')
        }, FIFTY_MINUTES)
        commit(MT.LIVE_TOKEN_REFRESHER_ID_CHANGED, refresherId)

        return Promise.all([dispatch('getAccount'), dispatch('getUser')])
      }).then(resolved => {
        commit(MT.ACCOUNT_CHANGED, resolved[0])
        commit(MT.USER_CHANGED, resolved[1])

        return resolved
      })
    },

    reset ({ rootState, state, commit, dispatch }) {
      localStorage.removeItem('state.session.liveToken')
      localStorage.removeItem('state.session.testToken')
      localStorage.removeItem('state.session.mode')

      if (state.liveTokenRefresherId) {
        clearInterval(state.liveTokenRefresherId)
      }
      if (state.testTokenRefresherId) {
        clearInterval(state.testTokenRefresherId)
      }
      commit(MT.READY, true)
    },

    setMode ({ state, commit, dispatch }, mode) {
      if (state.mode === mode) { return }

      if (mode === 'live') {
        if (state.testTokenRefresherId) {
          clearInterval(state.testTokenRefresherId)
        }

        commit(MT.TOKEN_CHANGED, state.liveToken)
        commit(MT.MODE_CHANGED, 'live')
        return
      }

      return freshcom.createToken({
        refresh_token: state.token.refresh_token, grant_type: 'refresh_token', scope: `account_id:${state.account.testAccountId}`
      }).then(token => {
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'test')
        commit(MT.READY, true)

        let refresherId = setInterval(() => {
          dispatch('refreshTestToken')
        }, FIFTY_MINUTES)
        commit(MT.TEST_TOKEN_REFRESHER_ID_CHANGED, refresherId)
      }).catch(response => {
        commit(MT.READY, true)
        throw response
      })
    },

    refreshLiveToken ({ state, commit }) {
      return freshcom.createToken({
        refresh_token: state.liveToken.refresh_token, grant_type: 'refresh_token'
      }).then(liveToken => {
        localStorage.setItem('state.session.liveToken', JSON.stringify(liveToken))

        console.log('refreshed live token')
        commit(MT.LIVE_TOKEN_CHANGED, liveToken)
        if (state.mode === 'live') {
          commit(MT.TOKEN_CHANGED, liveToken)
        }

        return liveToken
      })
    },

    refreshTestToken ({ state, commit }) {
      if (state.mode === 'live') { Promise.reject(new Error('currently in live mode')) }

      return freshcom.createToken({
        refresh_token: state.token.refresh_token, grant_type: 'refresh_token'
      }).then(testToken => {
        console.log('refreshed test token')
        if (state.mode === 'test') {
          commit(MT.TOKEN_CHANGED, testToken)
        }

        return testToken
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
    [MT.LIVE_TOKEN_CHANGED] (state, liveToken) {
      state.liveToken = liveToken
    },
    [MT.LIVE_TOKEN_REFRESHER_ID_CHANGED] (state, refresherId) {
      state.liveTokenRefresherId = refresherId
    },
    [MT.TEST_TOKEN_REFRESHER_ID_CHANGED] (state, refresherId) {
      state.testTokenRefresherId = refresherId
    },
    [MT.USER_CHANGED] (state, user) {
      state.user = user
    },
    [MT.ACCOUNT_CHANGED] (state, account) {
      state.account = account
    },
    [MT.MODE_CHANGED] (state, mode) {
      localStorage.setItem('state.session.mode', mode)
      state.mode = mode
    },
    [MT.READY] (state, ready) {
      state.ready = ready
    }
  }
}
