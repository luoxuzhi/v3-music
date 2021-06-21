<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <!-- scroll只对第一个子元素起作用，所以hot-keys和search-history外面多包一层 -->
      <div>
        <div class="hot-keys">
          <div class="title">热门搜索</div>
          <ul>
            <li
              v-for="item in hotKeys"
              class="item"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              {{ item.key }}
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <div class="title">
            <span class="text">搜索历史</span>
            <span class="icon" @click="showConfirm"
              ><i class="icon-clear"></i
            ></span>
          </div>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史？"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          ></confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="removeSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-singer="selectSinger"
        @select-song="selectSong"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <!-- appear为在当前路由时刷新时出现动画 -->
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { getHotKeys } from '@/service/search'
import { SINGER_KEY } from '@/assets/js/constant'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import storage from 'good-storage'
import Scroll from '@/components/wrap-scroll' // 使用此组件是使得出现mini-player的时候可以自适应
import useSearchHistory from '@/components/search/useSearchHistory'
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import SearchList from '@/components/base/search-list/search-list'
import Confirm from '@/components/base/confirm/confirm'

export default {
  name: 'search',
  components: {
    SearchInput,
    Scroll,
    Suggest,
    SearchList,
    Confirm,
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)
    const scrollRef = ref(null)
    const confirmRef = ref(null)

    const store = useStore()
    const searchHistory = computed(() => store.state.searchHistory)

    const router = useRouter()

    // hooks
    const { saveSearch, removeSearch, clearSearch } = useSearchHistory()

    getHotKeys().then((res) => {
      hotKeys.value = res.hotKeys
    })

    // 关闭搜索结果页展示搜索历史的时候如果满足滚动条件需要刷新
    // 因为scroll的内容是通过v-show控制
    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    function addQuery(hotKey) {
      query.value = hotKey
    }

    function selectSong(song) {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }

    function selectSinger(singer) {
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push({
        path: `/search/${singer.mid}`,
      })
    }

    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    return {
      query,
      hotKeys,
      addQuery,
      selectSinger,
      selectSong,
      selectedSinger,
      scrollRef,
      confirmRef,
      showConfirm,
      searchHistory,
      // useSearchHistory
      removeSearch,
      clearSearch,
    }
  },
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
