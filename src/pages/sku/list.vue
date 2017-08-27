<template>
  <div class="left-col">
    <left-nav></left-nav>
  </div>
</template>

<script>
import LeftNav from '@/components/left-nav'

export default {
  name: 'ListSku',
  components: {
    LeftNav
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.left-col {
  float: left;
  width: 200px;
}

</style>
