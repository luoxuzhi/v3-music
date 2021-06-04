import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)

  onMounted(() => {
    // console.log('wrapperRef.value :>> ', wrapperRef.value)
    const scrollVal = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options,
    }))

    // probeType大于0才会派发滚动事件
    if (options.probeType > 0) {
      scrollVal.on('scroll', pos => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  // 返回的scoll在setup中再次返回的时候，在实例中会和props里面的属性同级
  return scroll
}
