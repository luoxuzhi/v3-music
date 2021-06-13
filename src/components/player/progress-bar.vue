<template>
  <div class="progress-bar" @click="onProgressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
          :style="btnStyle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  name: 'progress-bar',
  data() {
    return {
      offset: 0,
    }
  },
  emits: ['progress-changing', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    progressStyle() {
      return `width:${this.offset}px`
    },
    btnStyle() {
      return `transform:translate3d(${this.offset}px,0,0)`
    },
  },
  watch: {
    progress(newProgress) {
      this.setOffset(newProgress)
    },
  },
  methods: {
    onTouchStart(e) {
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    onTouchMove(e) {
      const delta = e.touches[0].pageX - this.touch.x1
      const tempWidth = this.touch.beginWidth + delta
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 做01之间限制防止拖到进度条之外
      const progress = Math.min(1, Math.max(0, tempWidth / barWidth))
      this.offset = barWidth * progress
      this.$emit('progress-changing', progress)
    },
    onTouchEnd(e) {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    onProgressClick(e) {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const rect = this.$el.getBoundingClientRect()
      const progress = (e.pageX - rect.left) / barWidth
      this.$emit('progress-changed', progress)
    },
    // 此方法在player.vue也会调用，修复mini-player暂停状态切换到normal-player条形进度条
    // button位置不对问题
    setOffset(progress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * progress
    },
    // onTouchStart(e) {
    //   this.touch.x1 = e.touches[0].pageX
    //   this.touch.beginWith = this.$refs.progress.clientWidth
    // },
    // onTouchMove(e) {
    //   const barWidth = this.$el.clientWidth - progressBtnWidth
    //   const delta = e.touches[0].pageX - this.touch.x1
    //   const tempWidth = this.touch.beginWith + delta
    //   const progress = Math.min(1, Math.max(0, tempWidth / barWidth))
    //   this.offset = barWidth * progress
    //   this.$emit('progress-changing', progress)
    // },
    // onTouchEnd(e) {
    //   const barWidth = this.$el.clientWidth - progressBtnWidth
    //   const progress = this.$refs.progress.clientWidth / barWidth
    //   this.$emit('progress-changed', progress)
    // },
    // onProgressClick(e) {
    //   const barWidth = this.$el.clientWidth - progressBtnWidth
    //   const rect = this.$el.getBoundingClientRect()
    //   const progress = (e.pageX - rect.left) / barWidth
    //   this.$emit('progress-changed', progress)
    // },
  },
  created() {
    this.touch = {}
  },
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba($color: #000000, $alpha: 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      width: 30px;
      height: 30px;
      left: -8px;
      top: -13px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>