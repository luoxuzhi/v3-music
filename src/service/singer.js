import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export const getSingerDetail = singer => {
  // console.log('singer :', singer)
  return get('/api/getSingerDetail', { mid: singer.mid })
}
