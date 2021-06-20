<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle" />
  <player />
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { mapState } from 'vuex'

export default {
  components: {
    MHeader: Header,
    Tab,
    Player,
  },
  computed: {
    ...mapState(['playList']),
    // 保证一级路由页面在mini-player展示的时候底部自动有60px的距离
    viewStyle() {
      const bottom = this.playList.length ? '60px' : 0
      return { bottom }
    },
  },
}
</script>
