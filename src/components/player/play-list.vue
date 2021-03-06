<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <div class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="clear"
                ><i class="icon-clear"></i
              ></span>
            </div>
          </div>
          <scroll class="list-content" ref="scrollComp">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentSongIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  :class="{ disable: removing }"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="confirmRef"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
          @confirm="confirmClear"
        ></confirm>
        <add-song ref="addSongRef"></add-song>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useStore } from 'vuex'
import { computed, nextTick, ref, watch } from 'vue'
import useMode from './useMode'
import useFavorite from './useFavorite'
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/confirm'
import AddSong from '@/components/add-song/add-song'

export default {
  name: 'play-list',
  components: {
    Scroll,
    Confirm,
    AddSong,
  },
  setup() {
    const visible = ref(false)
    const removing = ref(false)
    const scrollComp = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)
    const addSongRef = ref(null)

    const store = useStore()
    const sequenceList = computed(() => store.state.sequenceList)
    const playList = computed(() => store.state.playList)
    const currentSong = computed(() => store.getters.currentSong)

    // hooks
    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    // 展示播放列表的时候自动滚动到对应的位置
    watch(currentSong, async (newSong) => {
      if (!visible.value || !newSong.id) return
      await nextTick()
      scrollToElement()
    })

    function getCurrentSongIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
      scrollToElement()
    }

    function hide() {
      visible.value = false
    }

    function refreshScroll() {
      scrollComp.value.scroll.refresh()
    }

    function scrollToElement() {
      const index = sequenceList.value.findIndex(
        (song) => song.id === currentSong.value.id
      )
      if (index === -1) return
      const ele = listRef.value.$el.children[index]
      scrollComp.value.scroll.scrollToElement(ele, 500)
    }

    function selectItem(song) {
      const index = playList.value.findIndex((item) => item.id === song.id)
      store.commit('setCurrentIndex', index)
    }

    function removeSong(song) {
      if (removing.value) return
      removing.value = true
      store.dispatch('removeSong', song)
      if (!playList.value.length) {
        hide()
      }
      setTimeout(() => {
        // 300为删除过渡动画的时间
        removing.value = false
      }, 300)
    }

    function clear() {
      confirmRef.value.show()
    }

    function confirmClear() {
      store.dispatch('clearSongList')
      hide()
    }

    function showAddSong() {
      addSongRef.value.show()
    }

    return {
      sequenceList,
      playList,
      visible,
      getCurrentSongIcon,
      show,
      hide,
      scrollComp,
      listRef,
      confirmRef,
      addSongRef,
      selectItem,
      removeSong,
      removing,
      clear,
      confirmClear,
      showAddSong,
      // useMode
      modeIcon,
      modeText,
      changeMode,
      // useFavorite
      getFavoriteIcon,
      toggleFavorite,
    }
  },
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>