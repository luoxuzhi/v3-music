import { ref, watch, nextTick } from 'vue'

export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)

  watch(
    () => props.data,
    async () => {
      // 等待dom真正渲染完成
      await nextTick()
      calculate()
    }
  )

  function calculate() {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    // debugger
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height = list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  function onScroll(pos) {
    console.log('pos :>> ', pos)
    scrollY.value = -pos.y
  }

  return { groupRef, onScroll }
}
