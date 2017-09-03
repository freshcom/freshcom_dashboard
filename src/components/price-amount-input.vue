<template>
  <el-input :placeholder="placeholder" v-model="strValue" @focus="$event.target.select()" type="number" class="price-amount">
    <template slot="prepend">$</template>
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
        let valueInt = Math.round(parseFloat(Math.abs(value)) * 100)
        if (isNaN(valueInt)) {
          this.$emit('input', 0)
        } else {
          this.$emit('input', valueInt)
        }
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.price-amount {
  width: 150px;
}
</style>
