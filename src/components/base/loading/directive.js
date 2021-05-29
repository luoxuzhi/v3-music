import { createApp } from 'vue'
import Loading from './loading.vue'
import { addClass, removeClass } from '@/assets/js/dom'

// 具体样式定义在assets/scss/base.scss中
const relativeCls = 'g-relative'

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    // 获取真实dom节点
    const instance = app.mount(document.createElement('div'))
    // console.log('binding :', binding)
    el.instance = instance
    const title = binding.arg
    if (title) {
      instance.setTitle(title)
    }

    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    const title = binding.arg
    if (title) {
      el.instance.setTitle(title)
    }

    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  },
}

function append(el) {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}

function remove(el) {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
