<template>
  <el-autocomplete
    v-model="productChoice"
    :fetch-suggestions="queryProduct"
    placeholder="Search for product..."
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
import ProductAPI from '@/api/product'

export default {
  name: 'ProductSelect',
  props: {
    filter: Object,
    default: function () {
      return {}
    }
  },
  data () {
    return {
      productChoice: undefined,
      selected: false
    }
  },
  methods: {
    queryProduct (searchKeyword, callback) {
      ProductAPI.queryRecord({ search: searchKeyword, filter: this.filter }).then(response => {
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
    setProduct (productChoice) {
      this.selected = true
      this.$emit('select', productChoice)
    },
    clear () {
      this.productChoice = undefined
      this.selected = false

      this.$emit('select', undefined)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
