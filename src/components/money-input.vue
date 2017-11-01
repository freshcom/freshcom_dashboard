<template>
  <div class="el-input el-input--small" :class="{ 'is-disabled': disabled }">
    <input v-model.lazy="model" v-money="{}" :disabled="disabled" autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner">
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'MoneyInput',
  props: {
    placeholder: String,
    value: Number,
    disabled: Boolean
  },
  methods: {
    updateValue: _.debounce(function (value) {
      this.$emit('input', value)

      if (value !== this.value) {
        this.$emit('change', value)
      }
    }, 300)
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (model) {
        let dollarValue = Number(model.replace(/[^0-9.-]/g, ''))
        if (dollarValue) {
          this.updateValue(Math.round(dollarValue * 100))
        } else {
          this.updateValue(0)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
