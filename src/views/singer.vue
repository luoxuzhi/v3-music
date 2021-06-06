<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" ref="indexList" @select="selectSinger"></index-list>
    <router-view :singer="selectedSinger"></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list'

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
      this.$router.push({
        path: `/singer/${singer.mid}`,
      })
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