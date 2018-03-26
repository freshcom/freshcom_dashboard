<template>
<resource-select
  :value="value"
  :disabled="disabled"
  :search-method="searchCustomer"
  :record-to-option="customerToOption"
  @input="handleInput($event)"
>
</resource-select>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import ResourceSelect from '@/components/resource-select'

export default {
  name: 'CustomerSelect',
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
    }
  },
  methods: {
    searchCustomer (keyword) {
      return freshcom.listCustomer({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    handleInput (customer) {
      this.$emit('input', customer)
    },

    customerToOption (customer) {
      if (!customer) {
        return { value: undefined }
      }

      let info = ''
      if (customer.code) {
        info += `[${customer.code}] `
      }
      info += customer.name + ' :: ' + customer.status
      return { value: customer.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
