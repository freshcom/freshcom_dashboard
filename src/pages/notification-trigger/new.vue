<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'ListNotificationTrigger' }">Triggers</router-link>
  </div>

  <div slot="card-header">
    <h1>Create a notification trigger</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
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

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import NotificationTrigger from '@/models/notification-trigger'
import NotificationTriggerFieldset from '@/components/notification-trigger-fieldset'

import PageMixin from '@/mixins/page'

export default {
  name: 'NewNotificationTrigger',
  mixins: [PageMixin],
  components: {
    NotificationTriggerFieldset
  },
  data () {
    return {
      notificationTriggerDraft: NotificationTrigger.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreating = true
      this.notificationTriggerDraft.actionTarget = this.notificationTriggerDraft.targetResource.id

      freshcom.createNotificationTrigger(this.notificationTriggerDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Notification trigger created successfully.`,
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
      this.$store.dispatch('pushRoute', { name: 'ListNotificationTrigger' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
