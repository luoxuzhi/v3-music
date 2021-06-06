import { get } from './base'

export const processSongs = songs => {
  if (!songs.length) return songs

  return get('/api/getSongsUrl', {
    mid: songs.map(song => song.mid),
  }).then(res => {
    const map = res.map
    return songs
      .map(song => {
        song.url = map[song.mid]
        return song
      })
      .filter(song => song.url && song.url.indexOf('vkey') > -1)
  })
}
