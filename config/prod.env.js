require('dotenv').config()

module.exports = {
  NODE_ENV: '"production"',
  API_ROOT_URL: JSON.stringify(process.env.API_ROOT_URL)
}
