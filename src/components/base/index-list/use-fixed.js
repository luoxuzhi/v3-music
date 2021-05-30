import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)

  watch(
    () => props.data,
    async () => {
      // 等待dom真正渲染完成
      await nextTick()
      calculate()
    }
  )

  watch(scrollY, newY => {
    const listHeightsVal = listHeights.value
    // console.log('newY :>> ', newY)
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        // 向上顶标题的功能
        distance.value = heightBottom - newY
        // console.log('distance.value :>> ', distance.value)
      }
    }
  })

  // 获取fixedTitle思路，监听滚动过程不断更新currentIndex
  const fixedTitle = computed(() => {
    // 下拉返回空
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 获取fixedStyle思路，监听滚动过程不停更新下一组歌手开头距离和当前scrollY的差值
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = distanceVal > 0 && distanceVal < TITLE_HEIGHT ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`,
    }
  })

  function calculate() {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  function onScroll(pos) {
    // console.log('pos :>> ', pos)
    scrollY.value = -pos.y
  }

  return { groupRef, onScroll, fixedTitle, fixedStyle }
}
