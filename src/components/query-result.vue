<template>
<div class="component-wrapper query-result" v-loading="isLoading">
  <div v-if="noQueryResult" class="notice">
    <p><icon name="search" scale="3"></icon></p>
    <p style="font-weight: 500;">There aren't any results that match your query.</p>
  </div>

  <template v-if="hasQueryResult">
    <slot></slot>

    <div class="footer">
      <span class="total">around {{totalCount}} results</span>
      <pagination :number="page.number" :size="page.size" :total="totalCount"></pagination>
    </div>
  </template>
</div>
</template>

<script>
import Pagination from '@/components/pagination'
export default {
  name: 'QueryResult',
  components: {
    Pagination
  },
  props: {
    totalCount: {
      type: Number,
      required: true
    },
    allCount: {
      type: Number,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true
    },
    page: {
      type: Object,
      required: true
    }
  },
  computed: {
    noQueryResult () {
      return !this.isLoading && this.totalCount === 0 && this.allCount > 0
    },
    hasQueryResult () {
      return !this.isLoading && this.totalCount !== 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.query-result {
  min-height: 300px;

  .notice {
    padding-top: 80px;
    color: #909399;
    padding-bottom: 100px;
    text-align: center;
    font-weight: 500;
  }

  .footer {
    text-align: right;
    padding: 20px;
    border-top: 0;

    .total {
      float: left;
      display: inline-block;
      font-size: 13px;
      min-width: 28px;
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
