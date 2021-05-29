<template>
  <m-header></m-header>
  <router-view />
</template>

<script>
import Header from '@/components/header/header'
export default {
  components: {
    MHeader: Header,
  },
}
</script>
