<template>
  <el-input :placeholder="placeholder" v-model="strValue" @focus="$event.target.select()" class="price-amount">
    <template slot="prepend">$</template>
    <!-- <template slot="append">{{xxx}}</template> -->
  </el-input>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'PriceAmountInput',
  props: ['placeholder', 'value'],
  computed: {
    strValue: {
      get () {
        return (this.value / 100).toFixed(2)
      },

      set: _.debounce(function (value) {
        this.$emit('input', Math.round(parseFloat(value) * 100))
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.price-amount {
  width: 300px;
}
</style>
