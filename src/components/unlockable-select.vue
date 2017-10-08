<template>
  <el-autocomplete
    v-model="inputModel"
    :fetch-suggestions="queryUnlockable"
    placeholder="Search for Unlockable..."
    :disabled="!!selectedOption"
    @select="setSelectedUnlockable"
  >

  <el-button v-if="selectedOption" slot="append" @click="clear()">
    <icon name="times" scale="0.8" class="v-middle"></icon>
  </el-button>

  </el-autocomplete>
</template>

<script>
import _ from 'lodash'
import JSONAPI from '@/jsonapi'
import UnlockableAPI from '@/api/unlockable'

export default {
  name: 'UnlockableSelect',
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
      this.selectedOption = this._unlockableToOption(newValue).value
    }
  },
  methods: {
    queryUnlockable (searchKeyword, callback) {
      UnlockableAPI.queryRecord({ search: searchKeyword }).then(response => {
        let apiPayload = response.data
        this.records = JSONAPI.deserialize(apiPayload.data)
        this.options = _.map(this.records, this._unlockableToOption)

        callback(this.options)
      })
    },
    setSelectedUnlockable (selectedOption) {
      let unlockable = _.find(this.records, { id: selectedOption.id })
      this.$emit('input', unlockable)
    },
    clear () {
      this.selectedOption = undefined
      this.inputModel = ''
      this.$emit('input', undefined)
    },
    _unlockableToOption (record) {
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
