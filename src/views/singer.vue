<template>
  <div class="singer" v-loading="!singers.length">
    <index-list
      :data="singers"
      ref="indexList"
      @select="selectSinger"
    ></index-list>
    <router-view v-slot="{ Component }">
      <!-- appear为在当前路由时刷新时出现动画 -->
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import IndexList from '@/components/index-list/index-list'
import storage from 'good-storage'
import { getSingerList } from '@/service/singer'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  data() {
    return {
      singers: [],
      selectedSinger: null,
    }
  },
  components: { IndexList },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
    // console.log('this.$refs.indexList :', this.$refs.indexList)
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`,
      })
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    },
  },
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>