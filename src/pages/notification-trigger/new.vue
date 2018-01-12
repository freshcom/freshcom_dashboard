<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/notification-triggers" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListNotificationTrigger' }" index="/notification-triggers">Templates</el-menu-item>
    </el-menu>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <span style="line-height: 36px;">Create a notification trigger</span>

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
          <notification-trigger-fieldset v-model="emailTemplateDraft" :errors="errors"></notification-trigger-fieldset>
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
import NotificationTrigger from '@/models/notification-trigger'
import NotificationTriggerFieldset from '@/components/notification-trigger-fieldset'

export default {
  name: 'NewNotificationTrigger',
  mixins: [PageMixin],
  components: {
    NotificationTriggerFieldset
  },
  data () {
    return {
      emailTemplateDraft: NotificationTrigger.objectWithDefaults(),
      isCreatingNotificationTrigger: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreatingNotificationTrigger = true
      this.emailTemplateDraft.actionTarget = this.emailTemplateDraft.actionTarget.id

      freshcom.createNotificationTrigger(this.emailTemplateDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Email template created successfully.`,
          type: 'success'
        })

        this.isCreatingNotificationTrigger = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingNotificationTrigger = false
        throw response
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListNotificationTrigger' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
