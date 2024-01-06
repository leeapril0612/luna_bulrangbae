import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { API_KEY } from './constant'
class HttpRequest {
  private instance: AxiosInstance

  constructor (option?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL: 'https://open.api.nexon.com',
      headers: {
        'x-nxopen-api-key': API_KEY
      },
      ...option
    })

    this.instance.interceptors.response.use(undefined, (err) => {
      // switch (err.response.status) {
      // //   case 401:
      // //     if (store.state.Auth.login) {
      // //       store.dispatch('LOGOUT')
      // //     }
      // //     router.push('/login')
      // //     break
      // }
      return Promise.reject(err)
    })
  }

  public request (option: AxiosRequestConfig): Promise<any> {
    return this.instance.request(option).then((res) => res.data)
  }
}
export default new HttpRequest()