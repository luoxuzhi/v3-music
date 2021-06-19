<template>
  <div class="music-list">
    <div class="back" @click="goBack"><i class="icon-back"></i></div>
    <div class="title">{{ title }}</div>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onSongScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/song-list/song-list'
import { mapActions, mapState } from 'vuex'

const RESERVE_HEIGHT = 40

export default {
  components: { Scroll, SongList },
  name: 'music-list',
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0,
    }
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      },
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲',
    },
    rank: Boolean,
  },
  computed: {
    noResult() {
      return !this.loading && !this.songs.length
    },
    bgImageStyle() {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      // translateZ是兼容iphone
      let translateZ = 0
      // 上滑效果
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVE_HEIGHT}px`
        translateZ = 1
      }
      // 下拉放大效果
      let scale = 1
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      // 歌手详情页歌曲上拉能挡住详情页是因为外层容器没有设置overflow:hidden
      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale}) translateZ(${translateZ}px)`,
      }
    },

    playBtnStyle() {
      let display = ''
      if (this.scrollY > this.maxTranslateY) {
        display = 'none'
      }
      return { display }
    },

    // 因为设备不同具体高度不同，因此scoll.list容器的top值不能
    // 通过css设置，需要通过js计算后设置
    scrollStyle() {
      const bottom = this.playList.length ? '60px' : 0 // 60px为mini player高度
      return {
        top: `${this.imageHeight}px`,
        bottom,
      }
    },
    filterStyle() {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      // scrollY>0为上推
      if (scrollY >= 0) {
        blur =
          Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
      }

      return {
        backdropFilter: `blur(${blur}px)`,
      }
    },
    ...mapState(['playList']),
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    onSongScroll(pos) {
      this.scrollY = -pos.y
    },
    selectItem({ song, index }) {
      this.selectPlay({ list: this.songs, index })
    },
    random() {
      this.randomPlay(this.songs)
    },
    ...mapActions(['selectPlay', 'randomPlay']),
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVE_HEIGHT
  },
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
