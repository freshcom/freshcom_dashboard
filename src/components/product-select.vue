<template>
  <el-autocomplete
    v-model="inputModel"
    :fetch-suggestions="queryProduct"
    placeholder="Search for product..."
    :disabled="!!selectedOption"
    @select="setProduct"
  >

  <el-button v-if="selectedOption" slot="append" @click="clear()">
    <icon name="times" scale="0.8" class="v-middle"></icon>
  </el-button>

  </el-autocomplete>
</template>

<script>
import _ from 'lodash'
import JSONAPI from '@/jsonapi'
import ProductAPI from '@/api/product'

export default {
  name: 'ProductSelect',
  props: {
    filter: {
      type: Object,
      default: function () {
        return {}
      }
    },
    include: String,
    value: Object
  },
  data () {
    return {
      inputModel: '',
      selectedOption: undefined,
      options: [],
      records: []
    }
  },
  watch: {
    value (newValue) {
      this.selectedOption = this._productToOption(newValue).value
    }
  },
  methods: {
    queryProduct (searchKeyword, callback) {
      ProductAPI.queryRecord({ search: searchKeyword, filter: this.filter, include: this.include }).then(response => {
        let apiPayload = response.data
        let records = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        this.records = records

        this.options = _.map(records, this._productToOption)
        callback(this.options)
      })
    },
    _productToOption (product) {
      if (!product) {
        return { value: undefined }
      }

      let info = ''
      if (product.code) {
        info += `[${product.code}] `
      }
      info += product.name + ' :: ' + product.status
      return { value: info, id: product.id }
    },
    setProduct (selectedOption) {
      let product = _.find(this.records, { id: selectedOption.id })
      this.$emit('input', product)
    },
    clear () {
      this.selectedOption = undefined
      this.inputModel = ''
      this.$emit('input', undefined)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
