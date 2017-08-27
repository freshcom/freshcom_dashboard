import qs from 'qs'
import axios from 'axios'
import { API_ROOT_URL } from '@/env'

let config = {
  baseURL: API_ROOT_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  paramsSerializer: function (params) {
    return qs.stringify(params)
  }
}

export default axios.create(config)
