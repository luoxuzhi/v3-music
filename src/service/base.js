import axios from 'axios'

const ERROR_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://ncuxz.fun/vue3-music/' : '/'

axios.defaults.baseURL = baseURL

export function get(url, params) {
  return axios
    .get(url, { params })
    .then(res => {
      const serverData = res.data
      if (serverData.code === ERROR_OK) {
        return serverData.result
      }
    })
    .catch(e => console.log(e))
}
