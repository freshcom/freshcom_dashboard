<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/notification-triggers" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListNotificationTrigger' }" index="/notification-triggers">Templates</el-menu-item>
    </el-menu>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
        <div slot="header">
          <div v-if="isViewingTestData" class="test-data-banner">
            <div class="banner-content">TEST DATA</div>
          </div>

          <div class="brief no-avatar">
            <div class="detail">
              <p>Notification Trigger</p>
              <h2>{{notificationTrigger.name}}</h2>
              <p class="id">{{notificationTrigger.id}}</p>
            </div>
          </div>

          <div class="header-actions">
            <el-button @click="editNotificationTrigger(notificationTrigger)" plain size="small">Edit</el-button>
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
                <dd>{{notificationTrigger.id}}</dd>

                <dt>Name</dt>
                <dd>{{notificationTrigger.name}}</dd>

                <dt>Description</dt>
                <dd>{{notificationTrigger.description}}</dd>

                <dt>Action Type</dt>
                <dd>{{notificationTrigger.actionType}}</dd>

                <dt>Last updated</dt>
                <dd>{{notificationTrigger.updatedAt | moment}}</dd>

                <dt>Creation date</dt>
                <dd>{{notificationTrigger.insertedAt | moment}}</dd>
              </dl>
            </div>
          </div>

          <div class="block-title">
            <h3>Related Resources</h3>
          </div>
          <div class="block">
            <div class="block-body">
              <dl>
                <dt v-if="notificationTrigger.actionType === 'sendEmail'">
                  Email Template
                </dt>
                <dd v-if="notificationTrigger.actionType === 'sendEmail'">
                  <router-link :to="{ name: 'ShowEmailTemplate', params: { id: notificationTrigger.actionTarget }}">
                    {{notificationTrigger.actionTarget}}
                  </router-link>
                </dd>
              </dl>
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
          <confirm-button @confirmed="deleteNotificationTrigger()" size="small">Delete</confirm-button>
        </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/file'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import NotificationTrigger from '@/models/email-template'
import ConfirmButton from '@/components/confirm-button'

export default {
  name: 'ShowNotificationTrigger',
  mixins: [PageMixin],
  components: {
    ConfirmButton
  },
  props: ['id'],
  data () {
    return {
      notificationTrigger: NotificationTrigger.objectWithDefaults(),
      isLoading: false,

      errors: {}
    }
  },
  created () {
    this.loadNotificationTrigger()
  },
  methods: {
    loadNotificationTrigger () {
      freshcom.retrieveNotificationTrigger(this.id).then(response => {
        this.notificationTrigger = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    deleteNotificationTrigger () {
      freshcom.deleteNotificationTrigger(this.notificationTrigger.id).then(() => {
        this.$message({
          showClose: true,
          message: `Trigger deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    editNotificationTrigger (notificationTrigger) {
      this.$store.dispatch('pushRoute', { name: 'EditNotificationTrigger', params: { id: notificationTrigger.id } })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListNotificationTrigger' })
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
