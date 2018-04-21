<template>
<resource-select
  :value="value"
  :disabled="disabled"
  :search-method="searchSmsTemplate"
  :record-to-option="smsTemplateToOption"
  :size="size"
  @input="handleInput($event)"
>
</resource-select>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import ResourceSelect from '@/components/resource-select'

export default {
  name: 'SmsTemplateSelect',
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
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  methods: {
    searchSmsTemplate (keyword) {
      return freshcom.listSmsTemplate({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    handleInput (smsTemplate) {
      this.$emit('input', smsTemplate)
    },

    smsTemplateToOption (smsTemplate) {
      if (!smsTemplate) {
        return { value: undefined }
      }

      let info = ''
      if (smsTemplate.code) {
        info += `[${smsTemplate.code}] `
      }
      info += smsTemplate.name
      return { value: smsTemplate.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
