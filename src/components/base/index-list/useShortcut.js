import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map(item => item.title)
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    if (isNaN(index)) return
    // const targetEle = groupRef.value.children[index]
    // const scroll = scrollRef.value.scroll
    // scroll.scrollToElement(targetEle, 0)

    // 保证锚点在shortcut范围内
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEle = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEle, 0)
  }

  return { shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove }
}
