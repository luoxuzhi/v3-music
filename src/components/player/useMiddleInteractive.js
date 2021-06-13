import { ref } from 'vue'

// 左右切换实现的关键
// move过程设置偏移量，end的时候设置终极状态并添加过渡效果
export default function useMiddleInteractive() {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    // touchstart需要重置
    touch.touchDirectionLocked = ''
  }
  function onMiddleTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (!touch.touchDirectionLocked) {
      touch.touchDirectionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    // 添加方向锁，不允许斜着滑动
    if (touch.touchDirectionLocked === 'v') return

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // 歌词界面的偏移量,在0与-window.innerWidth之间
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    touch.percent = Math.abs(offsetWidth) / window.innerWidth

    if (currentShow.value === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
    }
  }

  function onMiddleTouchEnd(e) {
    let offsetWidth, opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`, // 此处记得添加单位
      transitionDuration: `${duration}ms`,
    }
  }

  return { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd }
}
