import store from '@/store'
import freshcom from '@/freshcom-sdk'

// TODO: rename this file
export default function (callback) {
  let currentAccessToken = store.state.session.token.access_token
  let currentRefreshToken = store.state.session.token.refresh_token

  let liveAccessToken = store.state.session.liveToken.access_token
  let liveRefreshToken = store.state.session.liveToken.access_token

  freshcom.setAccessToken(liveAccessToken)
  freshcom.setRefreshToken(liveRefreshToken)

  return callback().then(() => {
    freshcom.setAccessToken(currentAccessToken)
    freshcom.setRefreshToken(currentRefreshToken)
  }).catch(response => {
    freshcom.setAccessToken(currentAccessToken)
    freshcom.setRefreshToken(currentRefreshToken)

    throw response
  })
}
