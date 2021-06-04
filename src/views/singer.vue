<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" ref="indexList"></index-list>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list'

export default {
  data() {
    return {
      singers: [],
    }
  },
  components: { IndexList },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
    console.log('this.$refs.indexList :', this.$refs.indexList)
  },
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>