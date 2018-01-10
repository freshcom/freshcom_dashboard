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
        <span style="line-height: 36px;">Edit email template</span>

        <div style="float: right;">
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
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import EmailTemplate from '@/models/email-template'
import EmailTemplateFieldset from '@/components/email-template-fieldset'

export default {
  name: 'EditEmailTemplate',
  mixins: [PageMixin],
  components: {
    EmailTemplateFieldset
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      emailTemplate: EmailTemplate.objectWithDefaults(),
      emailTemplateDraft: EmailTemplate.objectWithDefaults(),

      isUpdatingEmailTemplate: false,
      errors: {}
    }
  },
  created () {
    this.loadEmailTemplate()
  },
  methods: {
    loadEmailTemplate () {
      this.isLoading = true

      freshcom.retrieveEmailTemplate(this.id).then(response => {
        this.emailTemplate = response.data
        this.emailTemplateDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdatingEmailTemplate = true

      freshcom.updateEmailTemplate(
        this.emailTemplateDraft.id,
        this.emailTemplateDraft
      ).then(emailTemplate => {
        this.$message({
          showClose: true,
          message: `Email template saved successfully.`,
          type: 'success'
        })

        this.isUpdatingEmailTemplate = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingEmailTemplate = false
        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowEmailTemplate', params: { id: this.emailTemplate.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
