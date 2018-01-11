<template>
  <div class="component-wrapper notification-trigger-fieldset">
    <el-form-item label="Name" :error="errorMsgs.name" required>
      <el-input v-model="formModel.name" @input="updateValue"></el-input>
    </el-form-item>

    <el-form-item label="Event" :error="errorMsgs.event" required>
      <el-select @change="updateValue" v-model="formModel.event">
        <el-option label="identity.password_reset_token.created" value="identity.password_reset_token.created"></el-option>
        <el-option label="storefront.order.opened" value="storefront.order.opened"></el-option>
        <el-option label="storefront.order.paid" value="storefront.order.paid"></el-option>
        <el-option label="crm.customer.registered" value="crm.customer.registered"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Action Type" :error="errorMsgs.actionType" required>
      <el-select @change="updateValue" v-model="formModel.actionType">
        <el-option label="Send Email" value="sendEmail"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="formModel.actionType" label="Target" :error="errorMsgs.actionTarget" required>
      <remote-select
          :value="formModel.actionTarget"
          :search-method="searchEmailTemplate"
          :record-to-option="emailTemplateToOption"
          @change="handleEmailTemplateChange($event)"
          placeholder="Type to start searching..."
          class="email-template-select"
        >
        </remote-select>
    </el-form-item>

    <el-form-item label="Description">
      <el-input type="textarea" v-model="formModel.description" @input="updateValue"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import translateErrors from '@/helpers/translate-errors'
import RemoteSelect from '@/components/remote-select'

export default {
  name: 'NotificationTriggerFieldset',
  components: {
    RemoteSelect
  },
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'notificationTrigger')
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),

    handleEmailTemplateChange (emailTemplate) {
      if (emailTemplate) {
        this.formModel.actionTarget = emailTemplate
      } else {
        this.formModel.actionTarget = ''
      }

      this.$emit('input', this.formModel)
    },

    searchEmailTemplate (keyword) {
      return freshcom.listEmailTemplate({
        search: keyword
      }).then(response => {
        return response.data
      })
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
