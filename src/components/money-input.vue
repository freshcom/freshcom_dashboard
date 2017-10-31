<template>
  <el-input v-model="dollarStr" v-money="{}" :disabled="disabled" :placeholder="placeholder">
  </el-input>
</template>

<script>
export default {
  name: 'MoneyInput',
  props: ['placeholder', 'value', 'disabled'],
  computed: {
    dollarStr: {
      get () {
        return this.value
      },

      set (value) {
        let dollarValue = Number(value.replace(/[^0-9.]/g, ''))

        if (dollarValue) {
          this.$emit('input', dollarValue * 100)
        } else {
          this.$emit('input', 0)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
