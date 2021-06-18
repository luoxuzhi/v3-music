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
  } else {
    commit('setPlayList', state.sequenceList)
  }
  const index = state.playList.findIndex(song => song.id === currentSongId)
  // 保证当前播放歌曲不变
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)

  if (sequenceIndex < 0 || playIndex < 0) return

  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  // currentIndex===playList.length为删除最后一首的情况
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  // 如果删除正在播放的歌曲本身，playList发生变化导致currentSong发生变化，从而触发player的watch逻辑
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('setPlayingState', false)
  }
}

export function clearSongList({ commit }) {
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setCurrentIndex', 0)
  // currentIndex变化触发player中的watch播放歌曲，需要手动暂停
  commit('setPlayingState', false)
}

function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}
