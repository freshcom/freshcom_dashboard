<template>
<div class="component-wrapper search-input">
  <el-input :value="value" @input="inputHandler" size="small" placeholder="Search...">
    <div slot="prefix" class="prefix">
      <icon name="search" scale="0.8"></icon>
    </div>
  </el-input>
</div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'SearchInput',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    inputHandler: _.debounce(function (input) {
      let q
      if (_.isEmpty(input)) {
        q = _.omit(this.$route.query, ['search', 'page'])
      } else {
        q = _.merge(_.omit(this.$route.query, 'page'), { search: input })
      }
      this.$router.replace({ name: this.$store.state.route.name, query: q })
    }, 300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search-input {
  display: inline-block;
  margin-left: 30px;
  width: 350px;
}
</style>
