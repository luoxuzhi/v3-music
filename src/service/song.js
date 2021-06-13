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

const lyricMap = {}

export const getLyric = song => {
  const mid = song.mid

  // 播放器界面prev、next切换做优化，请求过的直接返回
  if (song.lyric) return Promise.resolve(song.lyric)

  // 歌手a->b->a歌词请求过不再重新请求
  if (lyricMap[mid]) return lyricMap[mid]

  return get('/api/getLyric', { mid }).then(result => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
