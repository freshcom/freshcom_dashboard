<template>
  <el-autocomplete
    v-model="productItemChoice"
    :fetch-suggestions="queryProduct"
    placeholder="Search for Product Item..."
    :disabled="selected"
    @select="setProduct"
  >

  <el-button v-if="selected" slot="append" @click="clear()">
    <icon name="times" scale="0.8" class="v-middle"></icon>
  </el-button>

  </el-autocomplete>
</template>

<script>
import _ from 'lodash'
import JSONAPI from '@/jsonapi'
import ProductItemAPI from '@/api/product-item'

export default {
  name: 'ProductItemSelect',
  data () {
    return {
      productItemChoice: undefined,
      selected: false
    }
  },
  methods: {
    queryProduct (searchKeyword, callback) {
      ProductItemAPI.queryRecord({ search: searchKeyword }).then(response => {
        let apiPayload = response.data
        let records = JSONAPI.deserialize(apiPayload.data)
        let names = _.map(records, (record) => {
          let info = ''
          if (record.code) {
            info += `[${record.code}] `
          }
          info += record.name + ' :: ' + record.status
          return { value: info, id: record.id }
        })

        callback(names)
      })
    },
    setProduct (productItemChoice) {
      this.selected = true
      this.$emit('select', productItemChoice.id)
    },
    clear () {
      this.productItemChoice = undefined
      this.selected = false

      this.$emit('select', undefined)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
