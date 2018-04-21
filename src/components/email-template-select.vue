<template>
<resource-select
  :value="value"
  :disabled="disabled"
  :search-method="searchEmailTemplate"
  :record-to-option="emailTemplateToOption"
  :size="size"
  @input="handleInput($event)"
>
</resource-select>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import ResourceSelect from '@/components/resource-select'

export default {
  name: 'EmailTemplateSelect',
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
    searchEmailTemplate (keyword) {
      return freshcom.listEmailTemplate({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    handleInput (emailTemplate) {
      this.$emit('input', emailTemplate)
    },

    emailTemplateToOption (emailTemplate) {
      if (!emailTemplate) {
        return { value: undefined }
      }

      let info = ''
      if (emailTemplate.code) {
        info += `[${emailTemplate.code}] `
      }
      info += emailTemplate.name
      return { value: emailTemplate.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
