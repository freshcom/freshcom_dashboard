<template>
  <el-autocomplete
    v-model="inputModel"
    :fetch-suggestions="querySku"
    placeholder="Search for SKU..."
    :disabled="!!selectedOption"
    @select="setSelectedSku"
  >

  <el-button v-if="selectedOption" slot="append" @click="clear()">
    <icon name="times" scale="0.8" class="v-middle"></icon>
  </el-button>

  </el-autocomplete>
</template>

<script>
import _ from 'lodash'
import JSONAPI from '@/jsonapi'
import SkuAPI from '@/api/sku'

export default {
  name: 'SkuSelect',
  props: {
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
      this.selectedOption = this._skuToOption(newValue).value
    }
  },
  methods: {
    querySku (searchKeyword, callback) {
      SkuAPI.queryRecord({ search: searchKeyword }).then(response => {
        let apiPayload = response.data
        this.records = JSONAPI.deserialize(apiPayload.data)
        this.options = _.map(this.records, this._skuToOption)

        callback(this.options)
      })
    },
    setSelectedSku (selectedOption) {
      let sku = _.find(this.records, { id: selectedOption.id })
      this.$emit('input', sku)
    },
    clear () {
      this.selectedOption = undefined
      this.inputModel = ''
      this.$emit('input', undefined)
    },
    _skuToOption (record) {
      if (!record) {
        return { value: undefined }
      }

      let info = ''
      if (record.code) {
        info += `[${record.code}] `
      }
      info += record.name + ' :: ' + record.status
      return { value: info, id: record.id }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
