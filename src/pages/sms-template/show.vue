<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListSms' }">SMS</router-link>
    <router-link :to="{ name: 'ListSmsTemplate' }">Templates</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <icon name="file-code-o" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>SMS Template</span>
        </p>
        <h1>{{smsTemplate.name}}</h1>
        <p class="id">{{smsTemplate.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditSmsTemplate', params: { id: smsTemplate.id } }" class="el-button el-button--small is-plain">
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
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteSmsTemplate()" plain size="small">Delete</el-button>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isConfirmingDeleteSmsTemplate" title="Delete SMS template" width="500px">
      <p>
        Are you sure you want to delete this SMS template? If you delete this SMS template,
        all of the following related resources if any will also be deleted:

        <ul>
          <li>All notification triggers that use this SMS template</li>
        </ul>

        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingSmsTemplate" @click="cancelDeleteSmsTemplate()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingSmsTemplate" @click="deleteSmsTemplate()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import SmsTemplate from '@/models/sms-template'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadSmsTemplate' })

export default {
  name: 'ShowSmsTemplate',
  mixins: [ResourcePageMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      smsTemplate: SmsTemplate.objectWithDefaults(),
      isLoading: false,
      isConfirmingDeleteSmsTemplate: false,
      isDeletingSmsTemplate: false,

      errors: {}
    }
  },
  created () {
    this.loadSmsTemplate()
  },
  methods: {
    loadSmsTemplate () {
      return freshcom.retrieveSmsTemplate(this.id).then(response => {
        this.smsTemplate = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    attemptDeleteSmsTemplate () {
      this.isConfirmingDeleteSmsTemplate = true
    },

    cancelDeleteSmsTemplate () {
      this.isConfirmingDeleteSmsTemplate = false
    },

    deleteSmsTemplate () {
      this.isDeletingSmsTemplate = true

      freshcom.deleteSmsTemplate(this.smsTemplate.id).then(() => {
        this.isDeletingSmsTemplate = false
        this.$message({
          showClose: true,
          message: `SMS template deleted successfully.`,
          type: 'success'
        })

        this.back()
      }).catch(() => {
        this.isDeletingSmsTemplate = false
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListSmsTemplate' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
