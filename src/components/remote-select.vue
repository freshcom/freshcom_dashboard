<template>
  <el-select
    v-model="selectedOption"
    @clear="clear"
    @change="changeHandler"
    @visible-change="visibleChangeHandler"
    :loading="isSearching"
    :remote-method="search"
    :placeholder="placeholder"
    :no-data-text="noDataText"
    remote
    filterable
    clearable
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value">
    </el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'RemoteSelect',
  props: {
    searchMethod: Function,
    value: null,
    placeholder: String,
    noDataText: String,
    recordToOption: {
      type: Function,
      default: function (record) {
        if (!record) {
          return { value: undefined }
        }

        let info = ''
        if (record.code) {
          info += `[${record.code}] `
        }
        info += record.name + ' :: ' + record.status
        return { value: record.id, label: info }
      }
    }
  },
  data () {
    return {
      isSearching: false,
      records: [],
      selectedOption: undefined,
      isDropdownVisible: false
    }
  },
  watch: {
    value (newValue) {
      this.selectedOption = this.recordToOption(newValue).value
    },
    selectedOption (newValue) {
      console.log(newValue)
      let record = _.find(this.records, { id: newValue })
      this.$emit('input', record)
    }
  },
  computed: {
    options () {
      return _.map(this.records, this.recordToOption)
    }
  },
  methods: {
    clear () {
      this.$emit('clear')
    },
    search (input) {
      if (!input) {
        this.records = []
        return
      }

      this.isSearching = true
      this._search(input)
    },
    _search: _.debounce(function (keyword) {
      return this.searchMethod(keyword).then(records => {
        this.records = records
        this.isSearching = false
      }).catch(() => {
        this.isSearching = false
      })
    }, 300),
    changeHandler (value) {
      this.$emit('change', _.find(this.records, { id: value }))
    },
    visibleChangeHandler (isVisible) {
      if (!isVisible && !this.selectedOption) {
        this.clear()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
