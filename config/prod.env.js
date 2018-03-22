'use strict'

module.exports = {
  NODE_ENV: '"production"',
  API_ROOT_URL: JSON.stringify(process.env.API_ROOT_URL),
  STRIPE_TEST_PUBLISHABLE_KEY: JSON.stringify(process.env.STRIPE_TEST_PUBLISHABLE_KEY),
  STRIPE_LIVE_PUBLISHABLE_KEY: JSON.stringify(process.env.STRIPE_LIVE_PUBLISHABLE_KEY),
  STRIPE_TEST_CLIENT_ID: JSON.stringify(process.env.STRIPE_TEST_CLIENT_ID),
  STRIPE_LIVE_CLIENT_ID: JSON.stringify(process.env.STRIPE_LIVE_CLIENT_ID),
  HOST_URL: JSON.stringify(process.env.HOST_URL)
}
