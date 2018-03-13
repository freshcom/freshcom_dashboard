import freshcom from '@/freshcom-sdk'
import Cookies from 'js-cookie'

const MT = {
  TOKEN_CHANGED: 'TOKEN_CHANGED',
  USER_CHANGED: 'USER_CHANGED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
  MODE_CHANGED: 'MODE_CHANGED',
  LIVE_TOKEN_CHANGED: 'LIVE_TOKEN_CHANGED',
  LIVE_TOKEN_REFRESHER_STARTED: 'LIVE_TOKEN_REFRESHER_STARTED',
  LIVE_TOKEN_REFRESHER_STOPPED: 'LIVE_TOKEN_REFRESHER_STOPPED',
  TEST_TOKEN_REFRESHER_STARTED: 'TEST_TOKEN_REFRESHER_STARTED',
  TEST_TOKEN_REFRESHER_STOPPED: 'TEST_TOKEN_REFRESHER_STOPPED',
  READY: 'READY'
}

const FIFTY_MINUTES = 3000000

function getObjectFromStorage (key, defaultValue) {
  let rawData = Cookies.get(key)
  if (!rawData) {
    return defaultValue
  }

  return JSON.parse(rawData)
}

function setObjectToStorage (key, value) {
  Cookies.set(key, JSON.stringify(value), { expires: 30 }) // expires in 7 days
}

function removeObjectFromStorage (key) {
  Cookies.remove(key)
}

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
      // Retrive live token
      let liveToken = getObjectFromStorage('state.session.liveToken')
      if (!liveToken) {
        return commit(MT.READY, true)
      }
      commit(MT.LIVE_TOKEN_CHANGED, liveToken)
      commit(MT.TOKEN_CHANGED, liveToken)

      // Setup session
      return dispatch('refreshLiveToken').then(() => {
        dispatch('startLiveTokenRefresher')

        return Promise.all([dispatch('getAccount'), dispatch('getUser')])
      }).then(() => {
        // Retrieve mode
        let mode = getObjectFromStorage('state.session.mode')
        if (mode === 'test') {
          return dispatch('setMode', mode)
        }
      }).then(() => {
        commit(MT.READY, true)
      }).catch(error => {
        console.log(error)
        dispatch('reset')
      })
    },

    create ({ state, commit, dispatch }, form) {
      let payload = {
        username: form.username,
        password: form.password,
        grant_type: 'password'
      }

      return freshcom.createToken(payload).then(token => {
        setObjectToStorage('state.session.liveToken', token)
        commit(MT.LIVE_TOKEN_CHANGED, token)
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'live')

        dispatch('startLiveTokenRefresher')

        return Promise.all([dispatch('getAccount'), dispatch('getUser')])
      })
    },

    reset ({ rootState, state, commit, dispatch }) {
      removeObjectFromStorage('state.session.liveToken')
      removeObjectFromStorage('state.session.testToken')
      removeObjectFromStorage('state.session.mode')

      commit(MT.LIVE_TOKEN_REFRESHER_STOPPED)
      commit(MT.TEST_TOKEN_REFRESHER_STOPPED)
      commit(MT.USER_CHANGED, undefined)
      commit(MT.ACCOUNT_CHANGED, undefined)
      commit(MT.LIVE_TOKEN_CHANGED, undefined)
      commit(MT.TOKEN_CHANGED, undefined)
      commit(MT.MODE_CHANGED, 'live')
      commit(MT.READY, true)
    },

    setMode ({ state, commit, dispatch }, mode) {
      if (state.mode === mode) { return }

      if (mode === 'live') {
        commit(MT.TEST_TOKEN_REFRESHER_STOPPED)
        commit(MT.TOKEN_CHANGED, state.liveToken)
        commit(MT.MODE_CHANGED, 'live')
        return
      }

      return freshcom.createToken({
        refresh_token: state.token.refresh_token, grant_type: 'refresh_token', scope: `account_id:${state.account.testAccountId}`
      }).then(token => {
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'test')

        dispatch('startTestTokenRefresher')
      })
    },

    refreshLiveToken ({ dispatch, state, commit }) {
      return freshcom.createToken({
        refresh_token: state.liveToken.refresh_token, grant_type: 'refresh_token'
      }).then(liveToken => {
        console.log('Refreshed live token')

        setObjectToStorage('state.session.liveToken', liveToken)
        commit(MT.LIVE_TOKEN_CHANGED, liveToken)

        if (state.mode === 'live') {
          commit(MT.TOKEN_CHANGED, liveToken)
        }

        return liveToken
      }).catch(error => {
        console.log(error)
        return dispatch('reset')
      })
    },

    startLiveTokenRefresher ({ dispatch, state, commit }) {
      if (state.liveTokenRefresherId) {
        return console.warn('Live token refresher already started')
      }

      let refresherId = setInterval(() => {
        dispatch('refreshLiveToken')
      }, FIFTY_MINUTES)

      commit(MT.LIVE_TOKEN_REFRESHER_STARTED, refresherId)
    },

    refreshTestToken ({ state, commit }) {
      if (state.mode === 'live') { Promise.reject(new Error('Currently in live mode')) }

      return freshcom.createToken({
        refresh_token: state.token.refresh_token, grant_type: 'refresh_token'
      }).then(testToken => {
        console.log('Refreshed test token')

        if (state.mode === 'test') {
          commit(MT.TOKEN_CHANGED, testToken)
        }

        return testToken
      })
    },

    startTestTokenRefresher ({ dispatch, state, commit }) {
      if (state.testTokenRefresherId) {
        return console.warn('Test token refresher already started')
      }

      let refresherId = setInterval(() => {
        dispatch('refreshTestToken')
      }, FIFTY_MINUTES)

      commit(MT.TEST_TOKEN_REFRESHER_STARTED, refresherId)
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

      if (token) {
        freshcom.setAccessToken(token.access_token)
      } else {
        freshcom.setAccessToken(undefined)
      }
    },
    [MT.LIVE_TOKEN_CHANGED] (state, liveToken) {
      state.liveToken = liveToken
    },
    [MT.LIVE_TOKEN_REFRESHER_STARTED] (state, refresherId) {
      state.liveTokenRefresherId = refresherId
    },
    [MT.LIVE_TOKEN_REFRESHER_STOPPED] (state) {
      if (state.liveTokenRefresherId) {
        clearInterval(state.liveTokenRefresherId)
      }
      state.liveTokenRefresherId = undefined
    },
    [MT.TEST_TOKEN_REFRESHER_STARTED] (state, refresherId) {
      state.testTokenRefresherId = refresherId
    },
    [MT.TEST_TOKEN_REFRESHER_STOPPED] (state) {
      if (state.testTokenRefresherId) {
        clearInterval(state.testTokenRefresherId)
      }
      state.testTokenRefresherId = undefined
    },
    [MT.USER_CHANGED] (state, user) {
      state.user = user
    },
    [MT.ACCOUNT_CHANGED] (state, account) {
      state.account = account
    },
    [MT.MODE_CHANGED] (state, mode) {
      setObjectToStorage('state.session.mode', mode)
      state.mode = mode
    },
    [MT.READY] (state, ready) {
      state.ready = ready
    }
  }
}
