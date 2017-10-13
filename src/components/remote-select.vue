<template>
  <el-select
    v-model="selectedOption"
    @visible-change="dropdownToggled"
    :loading="isLoading"
    :filter-method="filter"
    :placeholder="placeholder"
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
    value: Object,
    records: Array,
    placeholder: String,
    isLoading: Boolean,
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
      selectedOption: undefined,
      isDropdownVisible: false
    }
  },
  watch: {
    value (newValue) {
      this.selectedOption = this.recordToOption(newValue).value
    },
    selectedOption (newValue) {
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
    dropdownToggled (isVisible) {
      this.isDropdownVisible = isVisible

      if (isVisible) {
        console.log('dropdownToggled')
        return this.$emit('filter', this.selectedOption)
      }

      // Let the animation finish first then emit
      setTimeout(() => {
        this.$emit('reset')
      }, 300)
    },
    filter (input) {
      // Use setTimeout to let dropdownToggled execute first
      setTimeout(() => {
        if (this.isDropdownVisible) {
          this.$emit('filter', input)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
