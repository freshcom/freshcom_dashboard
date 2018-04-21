<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListNotificationTrigger' }">Triggers</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <icon name="external-link" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Notification Trigger</span>
        </p>
        <h1>{{notificationTrigger.name}}</h1>
        <p class="id">{{notificationTrigger.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditNotificationTrigger', params: { id: notificationTrigger.id } }" class="el-button el-button--small is-plain">
        Edit
      </router-link>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
          <dl>
            <dt>ID</dt>
            <dd>{{notificationTrigger.id}}</dd>

            <dt>Status</dt>
            <dd>{{notificationTrigger.status}}</dd>

            <dt>Name</dt>
            <dd>{{notificationTrigger.name}}</dd>

            <dt>Event</dt>
            <dd>{{notificationTrigger.event}}</dd>

            <dt>Description</dt>
            <dd>{{notificationTrigger.description}}</dd>

            <dt>Action Type</dt>
            <dd>{{$t(`fields.notificationTrigger.actionType.${notificationTrigger.actionType}`)}}</dd>

            <template v-if="notificationTrigger.actionType === 'webhook'">
              <dt>Action Target</dt>
              <dd>{{notificationTrigger.actionTarget}}</dd>
            </template>

            <dt>Last updated</dt>
            <dd>{{notificationTrigger.updatedAt | moment}}</dd>

            <dt>Creation date</dt>
            <dd>{{notificationTrigger.insertedAt | moment}}</dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <template v-if="notificationTrigger.actionType === 'sendEmail'">
              <dt>
                Email Template
              </dt>
              <dd>
                <router-link :to="{ name: 'ShowEmailTemplate', params: { id: notificationTrigger.actionTarget }}">
                  {{notificationTrigger.actionTarget}}
                </router-link>
              </dd>
            </template>

            <template v-if="notificationTrigger.actionType === 'sendSms'">
              <dt>
                SMS Template
              </dt>
              <dd>
                <router-link :to="{ name: 'ShowSmsTemplate', params: { id: notificationTrigger.actionTarget }}">
                  {{notificationTrigger.actionTarget}}
                </router-link>
              </dd>
            </template>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteNotificationTrigger()" plain size="small">Delete</el-button>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isConfirmingDeleteNotificationTrigger" title="Delete notification trigger" width="500px">
      <p>
        Are you sure you want to delete this notification trigger? If you delete this notification trigger, its
        associated action will no longer be triggered. Note that any associated Email or SMS template will not be
        deleted.
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingNotificationTrigger" @click="cancelDeleteNotificationTrigger()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingNotificationTrigger" @click="deleteNotificationTrigger()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import NotificationTrigger from '@/models/email-template'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadNotificationTrigger' })

export default {
  name: 'ShowNotificationTrigger',
  mixins: [ResourcePageMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      notificationTrigger: NotificationTrigger.objectWithDefaults(),
      isLoading: false,
      isConfirmingDeleteNotificationTrigger: false,
      isDeletingNotificationTrigger: false,

      errors: {}
    }
  },
  methods: {
    loadNotificationTrigger () {
      return freshcom.retrieveNotificationTrigger(this.id).then(response => {
        this.notificationTrigger = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    deleteNotificationTrigger () {
      return freshcom.deleteNotificationTrigger(this.notificationTrigger.id).then(() => {
        this.$message({
          showClose: true,
          message: `Notification trigger deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    attemptDeleteNotificationTrigger () {
      this.isConfirmingDeleteNotificationTrigger = true
    },

    cancelDeleteNotificationTrigger () {
      this.isConfirmingDeleteNotificationTrigger = false
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListNotificationTrigger' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
