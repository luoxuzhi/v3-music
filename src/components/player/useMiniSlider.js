import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  // bsscroll初始化时机：通过fullScreen控制的mini-player展示出来并且播放列表有值才进行初始化
  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playList = computed(() => store.state.playList)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value
  })

  onMounted(() => {
    // 缓存下来，只初始化一次
    let sliderVal
    // watch写在mounted里面是为了确保mini-player已经挂载，能访问到DOM
    watch(sliderShow, async newSliderShow => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          // sliderWrapperRef.value才是真正DOM元素
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          })

          sliderVal.on('slidePageChanged', ({ pageX }) => {
            // currentIndex发生变化会触发currentSong变化，player.vue检测到currentSong发生变化会做一系列操作
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          sliderVal.refresh()
        }
        // 切换到mini-player歌曲滚动到对应位置，经过前面的if else此时sliderVal已经赋值，所以可以调用goToPage方法
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 歌曲播放完成需要滚动下下一首的位置
    watch(currentIndex, newCurrentIndex => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newCurrentIndex, 0, 0)
      }
    })

    // 歌曲在播放列表删除的时候要刷新mini播放器里已经渲染的可左右滑动的DOM
    // 否则滑动到已经删除歌曲对应的DOM,专辑图展示不出来
    watch(playList, async newPlayList => {
      if (sliderVal && sliderShow.value && newPlayList.length) {
        await nextTick() // 需要等dom真正更新完再刷新
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return { sliderWrapperRef, slider }
}
