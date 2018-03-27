<template>
<resource-select
  :value="value"
  :disabled="disabled"
  :search-method="searchDepositable"
  :record-to-option="depositableToOption"
  :size="size"
  @input="handleInput($event)"
>
</resource-select>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import ResourceSelect from '@/components/resource-select'

export default {
  name: 'DepositableSelect',
  components: {
    ResourceSelect
  },
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  methods: {
    searchDepositable (keyword) {
      return freshcom.listDepositable({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    handleInput (depositable) {
      this.$emit('input', depositable)
    },

    depositableToOption (depositable) {
      if (!depositable) {
        return { value: undefined }
      }

      let info = ''
      if (depositable.code) {
        info += `[${depositable.code}] `
      }
      info += depositable.name + ' :: ' + depositable.status
      return { value: depositable.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
