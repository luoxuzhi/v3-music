import { h, mergeProps, withCtx, renderSlot, computed, ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import Scroll from '@/components/base/scroll/scroll'

export default {
  name: 'wrap-scroll',
  components: { Scroll },
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps({ ref: 'scrollRef' }, ctx.$props, { onScroll: e => ctx.$emit('scroll', e) }),
      {
        default: withCtx(() => [renderSlot(ctx.$slots, 'default')]),
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const scroll = computed(() => scrollRef.value.scroll)

    const store = useStore()
    const playList = computed(() => store.state.playList)

    watch(playList, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return { scrollRef, scroll }
  },
}
