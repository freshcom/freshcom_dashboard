<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/email-templates" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListEmail' }" index="/emails">
        Emails
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListEmailTemplate' }" index="/email-templates">
        Templates
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Edit email template</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="24">
          <el-form @submit.native.prevent="submit()" label-width="100px" size="small">
            <email-template-fieldset v-model="emailTemplateDraft" :errors="errors"></email-template-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import EmailTemplate from '@/models/email-template'
import EmailTemplateFieldset from '@/components/email-template-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadEmailTemplate' })

export default {
  name: 'EditEmailTemplate',
  mixins: [ResourcePageMixin],
  components: {
    EmailTemplateFieldset
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      emailTemplate: EmailTemplate.objectWithDefaults(),
      emailTemplateDraft: EmailTemplate.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  created () {
    this.loadEmailTemplate()
  },
  methods: {
    loadEmailTemplate () {
      this.isLoading = true

      return freshcom.retrieveEmailTemplate(this.id).then(response => {
        this.emailTemplate = response.data
        this.emailTemplateDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdating = true

      freshcom.updateEmailTemplate(
        this.emailTemplate.id,
        this.emailTemplateDraft
      ).then(emailTemplate => {
        this.$message({
          showClose: true,
          message: `Email template saved successfully.`,
          type: 'success'
        })

        this.isUpdating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ShowEmailTemplate', params: { id: this.emailTemplate.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
