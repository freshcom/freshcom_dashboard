<template>

<el-pagination
  @size-change="setPageSize"
  @current-change="setPageNumber"
  :current-page="number"
  :page-size="size"
  layout="prev, pager, next"
  :total="total">
</el-pagination>

</template>

<script>
import _ from 'lodash'

export default {
  name: 'Pagination',
  props: {
    number: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  methods: {
    setPageSize (size) {
      let q = _.merge({}, this.$route.query, { 'page[size]': size })
      this.$router.replace({ name: this.$route.name, query: q })
    },
    setPageNumber (number) {
      let q = _.merge({}, this.$route.query, { 'page[number]': number })
      this.$router.replace({ name: this.$route.name, query: q })
    }
  }
}
</script>

<style scoped>
</style>
