import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: { MusicList },
    props: {
      data: Object,
    },
    data() {
      return {
        songs: [],
        loading: true,
      }
    },
    computed: {
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      pic() {
        // 计算属性中，通过this.访问值的时候会触发依赖收集，所以访问一次以上的都缓存以优化性能
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      },
    },
    async created() {
      const data = this.computedData
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path,
        })
        return
      }
      const result = await fetch(data)
      console.log('result:', result)
      this.songs = await processSongs(result.songs)
      console.log('this.songs: ', this.songs)
      this.loading = false
    },
  }
}
