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
    <el-card v-loading="isLoading" class="main-card">
        <div slot="header">
          <div v-if="isViewingTestData" class="test-data-banner">
            <div class="banner-content">TEST DATA</div>
          </div>

          <div class="brief no-avatar">
            <div class="detail">
              <p>Email Template</p>
              <h2>{{emailTemplate.name}}</h2>
              <p class="id">{{emailTemplate.id}}</p>
            </div>
          </div>

          <div class="header-actions">
            <el-button @click="editEmailTemplate(emailTemplate)" plain size="small">Edit</el-button>
          </div>
        </div>

        <div class="data">
          <div class="block-title">
            <h3>Details</h3>
          </div>
          <div class="block">
            <div class="block-body">
              <dl>
                <dt>ID</dt>
                <dd>{{emailTemplate.id}}</dd>

                <dt>Name</dt>
                <dd>{{emailTemplate.name}}</dd>

                <dt>Description</dt>
                <dd>{{emailTemplate.description}}</dd>

                <dt>Last updated</dt>
                <dd>{{emailTemplate.updatedAt | moment}}</dd>

                <dt>Creation date</dt>
                <dd>{{emailTemplate.insertedAt | moment}}</dd>
              </dl>
            </div>
          </div>

          <div class="block-title">
            <h3>Preview</h3>
          </div>
          <div class="block">
            <div class="block-body full">
              <div class="content-preview">
                <iframe :srcdoc="emailTemplate.contentHtml"></iframe>
              </div>
            </div>
          </div>


          <h3>Related Resources</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>

          <h3>Logs</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>

          <h3>Events</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>
        </div>

        <div class="footer text-right">
          <confirm-button @confirmed="deleteEmailTemplate()" size="small">Delete</confirm-button>
        </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/file'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import EmailTemplate from '@/models/email-template'
import ConfirmButton from '@/components/confirm-button'

export default {
  name: 'ShowEmailTemplate',
  mixins: [PageMixin],
  components: {
    ConfirmButton
  },
  props: ['id'],
  data () {
    return {
      emailTemplate: EmailTemplate.objectWithDefaults(),
      isLoading: false,

      errors: {}
    }
  },
  created () {
    this.loadEmailTemplate()
  },
  methods: {
    loadEmailTemplate () {
      freshcom.retrieveEmailTemplate(this.id).then(response => {
        this.emailTemplate = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    deleteEmailTemplate () {
      freshcom.deleteEmailTemplate(this.emailTemplate.id).then(() => {
        this.$message({
          showClose: true,
          message: `File deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    editEmailTemplate (emailTemplate) {
      this.$store.dispatch('pushRoute', { name: 'EditEmailTemplate', params: { id: emailTemplate.id } })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListEmailTemplate' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-preview iframe {
  width: 100%;
  height: 800px;
  border: none;
}
</style>
