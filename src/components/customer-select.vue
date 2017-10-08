<template>
  <el-autocomplete
    v-model="inputModel"
    :fetch-suggestions="queryCustomer"
    placeholder="Search for Customer..."
    :disabled="!!selectedOption"
    @select="setSelectedCustomer"
  >

  <el-button v-if="selectedOption" slot="append" @click="clear()">
    <icon name="times" scale="0.8" class="v-middle"></icon>
  </el-button>

  </el-autocomplete>
</template>

<script>
import _ from 'lodash'
import JSONAPI from '@/jsonapi'
import CustomerAPI from '@/api/customer'
import Customer from '@/models/customer'

export default {
  name: 'CustomerSelect',
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
      this.selectedOption = this._customerToOption(newValue).value
    }
  },
  methods: {
    queryCustomer (searchKeyword, callback) {
      CustomerAPI.queryRecord({ search: searchKeyword }).then(response => {
        let apiPayload = response.data
        this.records = JSONAPI.deserialize(apiPayload.data)
        this.options = _.map(this.records, this._customerToOption)

        callback(this.options)
      })
    },
    setSelectedCustomer (selectedOption) {
      let customer = _.find(this.records, { id: selectedOption.id })
      this.$emit('input', customer)
    },
    clear () {
      this.selectedOption = undefined
      this.inputModel = ''
      this.$emit('input', undefined)
    },
    _customerToOption (record) {
      if (!record) {
        return { value: undefined }
      }

      let info = ''
      if (record.code) {
        info += `[${record.code}] `
      }

      info += Customer.fullName(record)
      info += ' :: ' + record.status
      return { value: info, id: record.id }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
