import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const store = useStore()

  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => (playing.value ? 'playing' : ''))

  watch(playing, newPlaying => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    // console.log('wrapperTransform :', wrapperTransform)
    wrapper.style.transform =
      // tansform合并用concat,最开始为'none'
      wrapperTransform === 'none' ? innerTransform : wrapperTransform.concat('', innerTransform)
  }

  return {
    cdRef,
    cdImageRef,
    cdCls,
  }
}
