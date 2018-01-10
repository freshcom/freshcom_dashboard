<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/email-templates" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListEmail' }" index="/emails">Emails</el-menu-item>
      <el-menu-item :route="{ name: 'ListEmailTemplate' }" index="/email-templates">Templates</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <span style="line-height: 36px;">Create an email template</span>

        <div class="pull-right">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" type="primary" size="small">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <el-form @submit.native.prevent="submit()" label-width="150px" size="small">
          <email-template-fieldset v-model="emailTemplateDraft" :errors="errors"></email-template-fieldset>
        </el-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit()" type="primary" class="pull-right" size="small">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import EmailTemplate from '@/models/email-template'
import EmailTemplateFieldset from '@/components/email-template-fieldset'

export default {
  name: 'NewEmailTemplate',
  mixins: [PageMixin],
  components: {
    EmailTemplateFieldset
  },
  data () {
    return {
      emailTemplateDraft: EmailTemplate.objectWithDefaults(),
      isCreatingEmailTemplate: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreatingEmailTemplate = true

      freshcom.createEmailTemplate(this.emailTemplateDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Email template created successfully.`,
          type: 'success'
        })

        this.isCreatingEmailTemplate = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingEmailTemplate = false
        throw response
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListEmailTemplate' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
