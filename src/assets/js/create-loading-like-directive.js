import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

// 具体样式定义在assets/scss/base.scss中
const relativeCls = 'g-relative'

export default function createLoadingLikeDirective(Comp) {
  return {
    mounted(el, binding) {
      const app = createApp(Comp)
      const name = Comp.name
      // 获取真实dom节点
      if (!el[name]) {
        el[name] = {}
      }
      const instance = app.mount(document.createElement('div'))
      // console.log('binding :', binding)
      el[name].instance = instance
      const title = binding.arg
      if (title) {
        instance.setTitle(title)
      }

      if (binding.value) {
        append(el, name)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      const name = Comp.name
      if (title) {
        el[name].instance.setTitle(title)
      }

      if (binding.value !== binding.oldValue) {
        binding.value ? append(el, name) : remove(el, name)
      }
    },
  }

  function append(el, name) {
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el, name) {
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
