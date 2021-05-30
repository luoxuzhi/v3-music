import { ref, watch, nextTick } from 'vue'

export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeights = ref([])

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

    console.log('groupRef.value :', groupRef.value)

    listHeightsVal.length = 0
    listHeightsVal.push(height)
    for (let i = 0; i < list.length; i++) {
      height = list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  return { groupRef }
}
