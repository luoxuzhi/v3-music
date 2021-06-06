<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="title" :loading="loading"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singer-detail',
  components: { MusicList },
  props: {
    singer: Object,
  },

  data() {
    return {
      songs: [],
      loading: true,
    }
  },

  computed: {
    computedSinger() {
      let ret = null
      const singer = this.singer
      if (singer) {
        ret = singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          ret = cachedSinger
        }
      }
      return ret
    },
    pic() {
      // 计算属性中，通过this.访问值的时候会触发依赖收集，所以访问一次以上的都缓存以优化性能
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    },
  },

  async created() {
    if (!this.computedSinger) {
      // console.log(this.$route.matched)
      const path = this.$route.matched[0].path
      this.$router.push({ path })
      return
    }

    const result = await getSingerDetail(this.computedSinger)
    const songs = await processSongs(result.songs)
    console.log(songs)
    // this.songs = songs
    this.songs = []
    this.loading = false
  },
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-background;
}
</style>