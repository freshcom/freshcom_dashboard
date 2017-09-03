<template>
  <el-input :placeholder="placeholder" v-model="strValue" @focus="$event.target.select()" type="number" class="percentage">
    <template slot="append">%</template>
  </el-input>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'PercentageInput',
  props: ['placeholder', 'value'],
  computed: {
    strValue: {
      get () {
        if (!this.value) {
          return 0
        } else {
          return this.value
        }
      },

      set: _.debounce(function (value) {
        let valueFloat = parseFloat(Math.abs(value))
        if (isNaN(valueFloat)) {
          this.$emit('input', 0)
        } else {
          this.$emit('input', valueFloat)
        }
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.percentage {
  width: 100px;
}
</style>
