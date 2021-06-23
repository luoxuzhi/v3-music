<template>
  <div class="top-list" v-loading="loading">
    <scroll class="top-list-content">
      <ul>
        <li
          v-for="item in topList"
          class="item"
          :key="item.id"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-lazy="item.pic" alt="" />
          </div>
          <ul class="song-list">
            <li
              v-for="(song, index) in item.songList"
              class="song"
              :key="song.id"
            >
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view v-slot="{ Component }">
      <!-- appear为在当前路由时刷新时出现动画 -->
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import Scroll from '@/components/wrap-scroll'
import storage from 'good-storage'
import { getTopList } from '@/service/top-list'
import { TOP_KEY } from '@/assets/js/constant'

export default {
  data() {
    return {
      topList: [],
      selectedTop: null,
      loading: true,
    }
  },
  components: { Scroll },
  async created() {
    const result = await getTopList()
    this.topList = result.topList
    this.loading = false
  },
  methods: {
    selectItem(top) {
      this.selectedTop = top
      this.cacheTop(top)
      this.$router.push({
        path: `/top-list/${top.id}`,
      })
    },
    cacheTop(top) {
      storage.session.set(TOP_KEY, top)
    },
  },
}
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
