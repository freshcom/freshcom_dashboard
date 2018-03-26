<template>
<resource-select
  :value="value"
  :disabled="disabled"
  :search-method="searchUnlockable"
  :record-to-option="unlockableToOption"
  @input="handleInput($event)"
>
</resource-select>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import ResourceSelect from '@/components/resource-select'

export default {
  name: 'UnlockableSelect',
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
    searchUnlockable (keyword) {
      return freshcom.listUnlockable({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    handleInput (unlockable) {
      this.$emit('input', unlockable)
    },

    unlockableToOption (unlockable) {
      if (!unlockable) {
        return { value: undefined }
      }

      let info = ''
      if (unlockable.code) {
        info += `[${unlockable.code}] `
      }
      info += unlockable.name + ' :: ' + unlockable.status
      return { value: unlockable.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
