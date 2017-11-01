'use strict'

require('dotenv').config()

module.exports = {
  NODE_ENV: '"production"',
  API_ROOT_URL: JSON.stringify(process.env.API_ROOT_URL),
  STRIPE_PUBLISHABLE_KEY: JSON.stringify(process.env.STRIPE_PUBLISHABLE_KEY),
  STRIPE_CLIENT_ID: JSON.stringify(process.env.STRIPE_CLIENT_ID)
}
