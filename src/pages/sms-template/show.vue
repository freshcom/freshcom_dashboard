<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/sms-templates" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListSms' }" index="/sms">SMS</el-menu-item>
      <el-menu-item :route="{ name: 'ListSmsTemplate' }" index="/sms-templates">Templates</el-menu-item>
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
              <p>Sms Template</p>
              <h2>{{smsTemplate.name}}</h2>
              <p class="id">{{smsTemplate.id}}</p>
            </div>
          </div>

          <div class="header-actions">
            <el-button @click="editSmsTemplate(smsTemplate)" plain size="small">Edit</el-button>
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
                <dd>{{smsTemplate.id}}</dd>

                <dt>Name</dt>
                <dd>{{smsTemplate.name}}</dd>

                <dt>Body</dt>
                <dd>{{smsTemplate.body}}</dd>

                <dt>Description</dt>
                <dd>{{smsTemplate.description}}</dd>

                <dt>Last updated</dt>
                <dd>{{smsTemplate.updatedAt | moment}}</dd>

                <dt>Creation date</dt>
                <dd>{{smsTemplate.insertedAt | moment}}</dd>
              </dl>
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
          <confirm-button @confirmed="deleteSmsTemplate()" size="small">Delete</confirm-button>
        </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/file'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import SmsTemplate from '@/models/sms-template'
import ConfirmButton from '@/components/confirm-button'

export default {
  name: 'ShowSmsTemplate',
  mixins: [PageMixin],
  components: {
    ConfirmButton
  },
  props: ['id'],
  data () {
    return {
      smsTemplate: SmsTemplate.objectWithDefaults(),
      isLoading: false,

      errors: {}
    }
  },
  created () {
    this.loadSmsTemplate()
  },
  methods: {
    loadSmsTemplate () {
      freshcom.retrieveSmsTemplate(this.id).then(response => {
        this.smsTemplate = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    deleteSmsTemplate () {
      freshcom.deleteSmsTemplate(this.smsTemplate.id).then(() => {
        this.$message({
          showClose: true,
          message: `SMS template deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    editSmsTemplate (smsTemplate) {
      this.$store.dispatch('pushRoute', { name: 'EditSmsTemplate', params: { id: smsTemplate.id } })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListSmsTemplate' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
