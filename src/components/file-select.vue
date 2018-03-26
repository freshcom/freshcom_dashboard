<template>
<resource-select
  :value="value"
  :disabled="disabled"
  :search-method="searchFile"
  :record-to-option="fileToOption"
  @input="handleInput($event)"
>
</resource-select>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import ResourceSelect from '@/components/resource-select'

export default {
  name: 'FileSelect',
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
    searchFile (keyword) {
      return freshcom.listFile({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    handleInput (file) {
      this.$emit('input', file)
    },

    fileToOption (file) {
      if (!file) {
        return { value: undefined }
      }

      let info = ''
      if (file.code) {
        info += `[${file.code}] `
      }
      info += file.name + ' :: ' + file.status
      return { value: file.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
