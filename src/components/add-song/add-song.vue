<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <span class="close" @click="hide"><i class="icon-close"></i></span>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲"></search-input>
        </div>
        <div v-show="!query">
          <Switches
            :switches="['最近播放', '搜索历史']"
            v-model="currentIndex"
          ></Switches>
          <div class="list-wrapper">
            <!-- 两个scroll不会同时存在，所以可以共用同一个scrollRef -->
            <Scroll
              ref="scrollRef"
              class="list-scroll"
              v-if="currentIndex === 0"
            >
              <div class="list-inner">
                <SongList
                  :songs="playHistory"
                  @select="selectSongBySongList"
                ></SongList>
              </div>
            </Scroll>
            <Scroll
              ref="scrollRef"
              class="list-scroll"
              v-if="currentIndex === 1"
            >
              <div class="list-inner">
                <SearchList
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                ></SearchList>
              </div>
            </Scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <Suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          ></Suggest>
        </div>
        <Message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </Message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import Switches from '@/components/base/switches/switches'
// 这个页面不需要适应miniplayer，所以用最基础的scroll
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
import SearchList from '@/components/base/search-list/search-list'
import Message from '@/components/base/message/message'
import useSearchHistory from '@/components/search/useSearchHistory'

export default {
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    Message,
  },
  setup() {
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const messageRef = ref(null)

    const store = useStore()
    const playHistory = computed(() => store.state.playHistory)
    const searchHistory = computed(() => store.state.searchHistory)

    // watch解决query清空返回v-show="!query"控制内容不能正常滚动bug
    // 因为切换v-show="query“展示内容的时候，scroll内容为dispaly:none，高度不正确
    watch(query, async () => {
      await nextTick()
      refreshScroll()
    })

    const { saveSearch } = useSearchHistory()

    async function show() {
      visible.value = true

      // 解决刷新页面后第一次进来最近播放/搜索历史不能滚动问题
      // 原因：初始化visible为false，整个dom display为none，所以scroll滚动内容高度不正确
      await nextTick()
      refreshScroll()
    }

    function hide() {
      visible.value = false
    }

    function addQuery(s) {
      query.value = s
    }

    function selectSongBySongList({ song }) {
      addSong(song)
    }

    function selectSongBySuggest(song) {
      addSong(song)
      saveSearch(query.value)
    }

    function addSong(song) {
      store.dispatch('addSong', song)
      messageRef.value.show()
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    return {
      visible,
      query,
      show,
      hide,
      addQuery,
      currentIndex,
      scrollRef,
      messageRef,
      playHistory,
      searchHistory,
      selectSongBySongList,
      selectSongBySuggest,
    }
  },
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
