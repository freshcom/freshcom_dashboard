<template>
  <el-input :placeholder="placeholder" v-model="strValue" @focus="$event.target.select()" type="number" class="percentage">
    <template slot="append">%</template>
  </el-input>
</template>

<script>
export default {
  name: 'PercentageInput',
  props: ['placeholder', 'value'],
  computed: {
    strValue: {
      get () {
        if (this.value === 0) {
          return '0'
        } else if (!this.value) {
          return ''
        } else {
          return this.value.toString()
        }
      },

      set (value) {
        let valueFloat = parseFloat(Math.abs(value))
        if (isNaN(valueFloat) || value === '') {
          this.$emit('input', null)
        } else {
          this.$emit('input', valueFloat)
        }
      }
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
