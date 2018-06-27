<template>
<content-container>
  <div slot="header">
    <el-menu :router="true" default-active="/sms-templates" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListSms' }" index="/sms">
        SMS
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListSmsTemplate' }" index="/sms-templates">
        Templates
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Create an SMS template</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form @submit.native.prevent="submit()" label-width="100px" size="small">
            <sms-template-fieldset v-model="smsTemplateDraft" :errors="errors"></sms-template-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>

</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import SmsTemplate from '@/models/sms-template'
import SmsTemplateFieldset from '@/components/sms-template-fieldset'

export default {
  name: 'NewSmsTemplate',
  mixins: [PageMixin],
  components: {
    SmsTemplateFieldset
  },
  data () {
    return {
      smsTemplateDraft: SmsTemplate.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreating = true

      freshcom.createSmsTemplate(this.smsTemplateDraft).then(response => {
        this.$message({
          showClose: true,
          message: `SMS template created successfully.`,
          type: 'success'
        })

        this.isCreating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListSmsTemplate' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
