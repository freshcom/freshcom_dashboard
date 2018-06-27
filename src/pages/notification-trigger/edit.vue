<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/notification-triggers" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListNotificationTrigger' }" index="/notification-triggers">
        Triggers
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Edit notification trigger</h1>

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
        <el-col :span="14" :offset="5">
          <el-form @submit.native.prevent="submit()" label-width="120px" size="small">
            <notification-trigger-fieldset v-model="notificationTriggerDraft" :errors="errors"></notification-trigger-fieldset>
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

import NotificationTrigger from '@/models/notification-trigger'
import NotificationTriggerFieldset from '@/components/notification-trigger-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadNotificationTrigger' })

export default {
  name: 'EditNotificationTrigger',
  mixins: [ResourcePageMixin],
  components: {
    NotificationTriggerFieldset
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
      notificationTrigger: NotificationTrigger.objectWithDefaults(),
      notificationTriggerDraft: NotificationTrigger.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  methods: {
    loadNotificationTrigger () {
      this.isLoading = true

      return freshcom.retrieveNotificationTrigger(this.id, {
        include: 'avatar'
      }).then(response => {
        this.notificationTrigger = NotificationTrigger.setTargetResource(response.data)
        console.log(this.notificationTrigger.targetResource)
        this.notificationTriggerDraft = _.cloneDeep(this.notificationTrigger)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdating = true

      freshcom.updateNotificationTrigger(
        this.notificationTriggerDraft.id,
        this.notificationTriggerDraft
      ).then(notificationTrigger => {
        this.$message({
          showClose: true,
          message: `Notification trigger saved successfully.`,
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
      this.$store.dispatch('pushRoute', { name: 'ShowNotificationTrigger', params: { id: this.notificationTrigger.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
