<template>
  <el-input :placeholder="placeholder" v-model="strValue" @focus="$event.target.select()" :disabled="disabled" type="number" class="price-amount">
    <template slot="prepend">$</template>
  </el-input>
</template>

<script>
export default {
  name: 'PriceAmountInput',
  props: ['placeholder', 'value', 'disabled'],
  computed: {
    strValue: {
      get () {
        if (this.value === 0) {
          return '0.00'
        } else if (!this.value) {
          return ''
        } else {
          return (this.value / 100).toFixed(2)
        }
      },

      set (value) {
        let valueInt = Math.round(parseFloat(value) * 100)
        if (isNaN(valueInt)) {
          this.$emit('input', 0)
          this.$emit('change', 0)
        } else {
          this.$emit('input', valueInt)
          this.$emit('change', valueInt)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.price-amount {
  width: 120px;
}
</style>
