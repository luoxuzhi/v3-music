import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// 歌手详情页点击某一首歌曲调用此方法
export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}

export function changeMode({ commit, state, getters }, mode) {
  const currentSongId = getters.currentSong.id

  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else if (mode === PLAY_MODE.loop) {
    commit('setPlayList', [getters.currentSong])
  } else {
    commit('setPlayList', state.sequenceList)
  }
  const index = state.playList.findIndex(song => song.id === currentSongId)
  // 保证当前播放歌曲不变
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}
