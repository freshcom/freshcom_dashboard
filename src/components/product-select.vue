<template>
<resource-select
  :value="value"
  :disabled="disabled"
  :search-method="searchProduct"
  :record-to-option="productToOption"
  @input="handleInput($event)"
  size="small"
>
</resource-select>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import ResourceSelect from '@/components/resource-select'

export default {
  name: 'ProductSelect',
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
    },
    include: {
      type: String,
      default: ''
    },
    filter: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    searchProduct (keyword) {
      return freshcom.listProduct({
        search: keyword,
        filter: this.filter,
        include: this.include
      }).then(response => {
        return response.data
      })
    },

    handleInput (product) {
      this.$emit('input', product)
    },

    productToOption (product) {
      if (!product) {
        return { value: undefined }
      }

      let info = ''
      if (product.code) {
        info += `[${product.code}] `
      }
      info += product.name + ' :: ' + product.status
      return { value: product.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
