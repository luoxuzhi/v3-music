<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li
        v-for="search in searches"
        :key="search"
        class="search-item"
        @click="selectItem(search)"
      >
        <span class="text">{{ search }}</span>
        <span class="icon" @click.stop="deleteItem(search)"
          ><i class="icon-delete"></i
        ></span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'search-list',
  props: {
    searches: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteItem(item) {
      this.$emit('delete', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
