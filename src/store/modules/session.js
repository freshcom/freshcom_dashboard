import freshcom from '@/freshcom-sdk'

const MT = {
  TOKEN_CHANGED: 'TOKEN_CHANGED',
  USER_CHANGED: 'USER_CHANGED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
  MODE_CHANGED: 'MODE_CHANGED',
  READY: 'READY'
}

export default {
  namespaced: true,
  state: {
    ready: false,
    token: undefined,
    user: undefined,
    account: undefined,
    mode: 'live'
  },
  actions: {
    // TODO: change name
    getToken ({ commit, dispatch }) {
      let rawLiveToken = localStorage.getItem('state.session.liveToken')
      if (!rawLiveToken) {
        return dispatch('logout')
      }

      let liveToken = JSON.parse(rawLiveToken)
      return freshcom.createToken({
        refresh_token: liveToken.refresh_token, grant_type: 'refresh_token'
      }).then(liveToken => {
        localStorage.setItem('state.session.liveToken', JSON.stringify(liveToken))
        commit(MT.TOKEN_CHANGED, liveToken)

        return liveToken
      }).then(() => {
        return Promise.all([dispatch('getAccount'), dispatch('getUser')])
      }).then((resolved) => {
        let rawMode = localStorage.getItem('state.session.mode')
        let mode = rawMode === 'test' ? 'test' : 'live'

        if (mode === 'test') {
          return dispatch('setMode', mode)
        }

        return resolved
      }).then(() => {
        commit(MT.READY, true)
      }).catch(error => {
        dispatch('logout')
        throw error.response.data
      })
    },

    login ({ state, commit, dispatch }, form) {
      let payload = {
        username: form.username,
        password: form.password,
        grant_type: 'password'
      }

      return freshcom.createToken(payload).then(token => {
        localStorage.setItem('state.session.liveToken', JSON.stringify(token))
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'live')

        return Promise.all([dispatch('getAccount'), dispatch('getUser')])
      }).then(resolved => {
        commit(MT.ACCOUNT_CHANGED, resolved[0])
        commit(MT.USER_CHANGED, resolved[1])

        return resolved
      })
    },

    logout ({ rootState, state, commit, dispatch }) {
      localStorage.removeItem('state.session.liveToken')
      localStorage.removeItem('state.session.testToken')
      localStorage.removeItem('state.session.mode')
      commit(MT.READY, true)

      if (rootState.route.name !== 'Login') {
        dispatch('pushRoute', { name: 'Login' }, { root: true })
      }
    },

    setMode ({ state, commit, dispatch }, mode) {
      if (state.mode === mode) { return }
      if (mode === 'live') {
        return dispatch('getToken').then(() => {
          commit(MT.MODE_CHANGED, 'live')
        })
      }

      return freshcom.createToken({
        refresh_token: state.token.refresh_token, grant_type: 'refresh_token', scope: `account_id:${state.account.testAccountId}`
      }).then(token => {
        commit(MT.TOKEN_CHANGED, token)
        commit(MT.MODE_CHANGED, 'test')
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
    [MT.MODE_CHANGED] (state, mode) {
      localStorage.setItem('state.session.mode', mode)
      state.mode = mode
    },
    [MT.READY] (state, ready) {
      state.ready = ready
    }
  }
}
