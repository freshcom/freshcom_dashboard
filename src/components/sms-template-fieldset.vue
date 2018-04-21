<template>
  <div class="component-wrapper sms-template-fieldset">
    <el-form-item label="Name" :error="errorMsgs.name" required>
      <el-input v-model="formModel.name" @input="updateValue()"></el-input>
    </el-form-item>

    <el-form-item label="To" :error="errorMsgs.to" required>
      <el-input v-model="formModel.to" @input="updateValue()"></el-input>
    </el-form-item>

    <el-form-item label="Body" :error="errorMsgs.body" required>
      <el-input v-model="formModel.body" @input="updateValue()" type="textarea"></el-input>
    </el-form-item>

    <el-form-item label="Description">
      <el-input v-model="formModel.description" @input="updateValue()" type="textarea"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'emailTemplate' })

export default {
  name: 'SmsTemplateFieldset',
  mixins: [FieldsetMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
