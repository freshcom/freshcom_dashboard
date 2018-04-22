<template>
  <div class="component-wrapper notification-trigger-fieldset">
    <el-form-item label="Name" :error="errorMsgs.name" required>
      <el-input v-model="formModel.name" @input="updateValue()"></el-input>
    </el-form-item>

    <el-form-item label="Event" :error="errorMsgs.event" required>
      <el-select v-model="formModel.event" :disabled="!!formModel.id" @change="updateValue()">
        <el-option label="identity.password_reset_token.created" value="identity.password_reset_token.created"></el-option>
        <el-option label="storefront.order.opened" value="storefront.order.opened"></el-option>
        <el-option label="storefront.order.paid" value="storefront.order.paid"></el-option>
        <el-option label="crm.customer.registered" value="crm.customer.registered"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Action Type" :error="errorMsgs.actionType" required>
      <el-select v-model="formModel.actionType" :disabled="!!formModel.id" @change="handleActionTypeChange()">
        <el-option label="Send Email" value="sendEmail"></el-option>
        <el-option label="Send SMS" value="sendSms"></el-option>
        <el-option label="Webhook" value="webhook"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="formModel.actionType === 'sendEmail'" label="Action Target" :error="errorMsgs.actionTarget" required>
      <email-template-select v-model="formModel.targetResource" @input="updateValue()"></email-template-select>
    </el-form-item>

    <el-form-item v-if="formModel.actionType === 'sendSms'" label="Action Target" :error="errorMsgs.actionTarget" required>
      <sms-template-select v-model="formModel.targetResource" @input="updateValue()"></sms-template-select>
    </el-form-item>

    <el-form-item label="Description">
      <el-input type="textarea" v-model="formModel.description" @input="updateValue()"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import EmailTemplateSelect from '@/components/email-template-select'
import SmsTemplateSelect from '@/components/sms-template-select'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'notificationTrigger' })

export default {
  name: 'NotificationTriggerFieldset',
  mixins: [FieldsetMixin],
  components: {
    EmailTemplateSelect,
    SmsTemplateSelect
  },
  methods: {
    handleActionTypeChange () {
      this.formModel.targetResource = {}
      this.updateValue()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
