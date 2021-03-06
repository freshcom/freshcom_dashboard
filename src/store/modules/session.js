import { API_CLIENT_ID } from '@/env'
import freshcom from '@/freshcom-sdk'
import Cookies from 'js-cookie'

const MT = {
  TOKEN_CHANGED: 'TOKEN_CHANGED',
  USER_CHANGED: 'USER_CHANGED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
  MODE_CHANGED: 'MODE_CHANGED',
  LIVE_TOKEN_CHANGED: 'LIVE_TOKEN_CHANGED',
  READY: 'READY'
}

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
    mode: 'live'
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
      return Promise.all([dispatch('getAccount'), dispatch('getUser')]).then(() => {
        // Retrieve mode
        let mode = getObjectFromStorage('state.session.mode')
        if (mode === 'test') {
          return dispatch('setMode', mode)
        }
      }).then(() => {
        commit(MT.READY, true)
      }).catch(() => {
        dispatch('reset')
      })
    },

    changeAccount ({ state, commit, dispatch }, accountId) {
      let payload = {
        client_id: API_CLIENT_ID,
        refresh_token: state.liveToken.refresh_token,
        grant_type: 'refresh_token',
        scope: `acc:${accountId}`
      }

      return freshcom.createToken(payload).then(token => {
        commit(MT.LIVE_TOKEN_CHANGED, token)
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'live')

        return dispatch('getAccount').then((account) => {
          if (!account.isReadyForLiveTransaction) {
            dispatch('setMode', 'test')
          }
        })
      })
    },

    setToken ({ commit }, token) {
      // If we just refreshed live access token
      if (token.refresh_token.startsWith('urt-live')) {
        commit(MT.LIVE_TOKEN_CHANGED, token)

        // Only change the token if we are also in live mode.
        // It could be that we are actually in test mode but
        // viewing a section that is only avilable in live mode
        // in which case will be in test mode but trying to
        // refresh the live token
        if (this.mode === 'live') {
          commit(MT.TOKEN_CHANGED, token)
        }
      } else {
        commit(MT.TOKEN_CHANGED, token)
      }
    },

    create ({ state, commit, dispatch }, form) {
      let payload = {
        username: form.username,
        password: form.password,
        client_id: API_CLIENT_ID,
        grant_type: 'password'
      }
      if (form.type === 'managed') {
        payload.scope = `acc:${form.account}`
      }

      return freshcom.createToken(payload).then(token => {
        commit(MT.LIVE_TOKEN_CHANGED, token)
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'live')

        return Promise.all([dispatch('getAccount'), dispatch('getUser')]).then(data => {
          let account = data[0]

          if (!account.isReadyForLiveTransaction) {
            dispatch('setMode', 'test')
          }
        })
      })
    },

    reset ({ rootState, state, commit, dispatch }) {
      removeObjectFromStorage('state.session.liveToken')
      removeObjectFromStorage('state.session.mode')

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
        commit(MT.TOKEN_CHANGED, state.liveToken)
        commit(MT.MODE_CHANGED, 'live')
        return dispatch('getAccount')
      }

      return freshcom.createToken({
        refresh_token: state.token.refresh_token,
        grant_type: 'refresh_token',
        client_id: API_CLIENT_ID,
        scope: `acc:${state.account.testAccountId}`
      }).then(token => {
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'test')

        return dispatch('getAccount')
      })
    },

    getUser ({ state, commit }) {
      if (!state.token) { return }

      return freshcom.retrieveCurrentUser().then(response => {
        let user = response.data
        commit(MT.USER_CHANGED, user)

        return user
      })
    },

    setUser ({ commit }, user) {
      commit(MT.USER_CHANGED, user)
    },

    getAccount ({ state, commit, dispatch }) {
      return freshcom.retrieveAccount().then(response => {
        let account = response.data
        commit(MT.ACCOUNT_CHANGED, account)
        dispatch('setResourceLocale', account.defaultLocale, { root: true })

        return account
      })
    },

    setAccount ({ commit }, account) {
      commit(MT.ACCOUNT_CHANGED, account)
    }
  },

  mutations: {
    [MT.TOKEN_CHANGED] (state, token) {
      state.token = token

      if (token) {
        freshcom.setAccessToken(token.access_token)
        freshcom.setRefreshToken(token.refresh_token)
      } else {
        freshcom.setAccessToken(API_CLIENT_ID)
      }
    },
    [MT.LIVE_TOKEN_CHANGED] (state, liveToken) {
      if (liveToken) {
        setObjectToStorage('state.session.liveToken', liveToken)
      } else {
        removeObjectFromStorage('state.session.liveToken')
      }
      state.liveToken = liveToken
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
