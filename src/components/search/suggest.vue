<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon"><i class="icon-mine"></i></div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        v-for="song in songs"
        class="suggest-item"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon"><i class="icon-music"></i></div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import usePullUpLoad from './usePullUpLoad'
import { getSearch } from '@/service/search'
import { processSongs } from '@/service/song'
export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['select-singer', 'select-song'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const page = ref(1)
    const hasMore = ref(true)
    const loadingText = ref(' ')
    const noResultText = ref('抱歉，暂无搜索结果')
    const manualLoading = ref(false)

    const loading = computed(() => !singer.value && !songs.value.length)
    const noResult = computed(
      () => !singer.value && !songs.value.length && !hasMore.value
    )
    const pullUpLoading = computed(() => isPullUpLoad.value && hasMore.value)

    // 解决同时出现两个loading
    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    // hooks
    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(
      searchMore,
      preventPullUpLoad
    )

    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) return
        await searchFirst()
      }
    )

    async function searchFirst() {
      if (!props.query) return
      singer.value = null
      songs.value = []
      page.value = 1
      hasMore.value = true

      const result = await getSearch(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function searchMore() {
      if (!props.query || !hasMore.value) return
      page.value++
      const result = await getSearch(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function makeItScrollable() {
      // 不满足滚动条件
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    function selectSinger(singer) {
      emit('select-singer', singer)
    }

    function selectSong(song) {
      emit('select-song', song)
    }

    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText,
      pullUpLoading,
      selectSinger,
      selectSong,
      // pullUpLoad
      rootRef,
    }
  },
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
