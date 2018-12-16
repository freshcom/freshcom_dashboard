import store from '@/store'
import freshcom from '@/freshcom-sdk'

// TODO: rename this file
export default function (callback) {
  let liveAccessToken = store.state.session.liveToken.access_token
  let liveRefreshToken = store.state.session.liveToken.refresh_token

  freshcom.setAccessToken(liveAccessToken)
  freshcom.setRefreshToken(liveRefreshToken)

  return callback().then(() => {
    freshcom.setAccessToken(store.state.session.token.access_token)
    freshcom.setRefreshToken(store.state.session.token.refresh_token)
  }).catch(response => {
    freshcom.setAccessToken(store.state.session.token.access_token)
    freshcom.setRefreshToken(store.state.session.token.refresh_token)

    throw response
  })
}
