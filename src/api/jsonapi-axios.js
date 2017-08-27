import qs from 'qs'
import axios from 'axios'
import { API_ROOT_URL, DEFAULT_LOCALE } from '@/env'

let config = {
  baseURL: API_ROOT_URL,
  headers: {
    'Content-Type': 'application/vnd.api+json'
  },
  params: {
    locale: DEFAULT_LOCALE
  },
  paramsSerializer: function (params) {
    return qs.stringify(params)
  }
}

export default axios.create(config)
