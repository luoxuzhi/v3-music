<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll class="search-content">
      <div>
        <div class="hot-keys">
          <div class="title">搜索历史</div>
          <ul>
            <li
              v-for="item in hotKeys"
              class="item"
              :key="item.id"
              @click="addQuery(item)"
            >
              {{ item.key }}
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { getHotKeys } from '@/service/search'
import SearchInput from '@/components/search/search-input'
import Scroll from '@/components/wrap-scroll'

export default {
  name: 'search',
  components: {
    SearchInput,
    Scroll,
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])

    getHotKeys().then((res) => {
      hotKeys.value = res.hotKeys
    })

    watch(query, (newQuery) => console.log(newQuery))

    function addQuery(hotKey) {
      query.value = hotKey.key
    }
    return { query, hotKeys, addQuery }
  },
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
