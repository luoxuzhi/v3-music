import { useStore } from 'vuex'
import { computed } from 'vue'
import { SEARCH_KEY } from '@/assets/js/constant'
import { save, remove, clear } from '@/assets/js/array-store'

export default function useSearchHistory() {
  const store = useStore()

  function saveSearch(query) {
    const searches = save(query, SEARCH_KEY, item => item === query)
    store.commit('setSearchHistory', searches)
  }

  function removeSearch(query) {
    const searches = remove(SEARCH_KEY, item => item === query)
    store.commit('setSearchHistory', searches)
  }

  function clearSearch() {
    clear(SEARCH_KEY)
    store.commit('setSearchHistory', [])
  }

  return { saveSearch, removeSearch, clearSearch }
}
