<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListEmail' }">Emails</router-link>
    <router-link :to="{ name: 'ListEmailTemplate' }">Templates</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <icon name="file-code-o" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Email Template</span>
        </p>
        <h1>{{emailTemplate.name}}</h1>
        <p class="id">{{emailTemplate.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditEmailTemplate', params: { id: emailTemplate.id } }" class="el-button el-button--small is-plain">
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

      <div class="block">
        <div class="header">
          <h2>Body HTML Preview</h2>
        </div>
        <div class="body full">
          <div class="body-html-preview">
            <iframe :srcdoc="emailTemplate.bodyHtml"></iframe>
          </div>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteEmailTemplate()" plain size="small">Delete</el-button>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isConfirmingDeleteEmailTemplate" title="Delete email template" width="500px">
      <p>
        Are you sure you want to delete this email template? If you delete this email template,
        all of the following related resources if any will also be deleted:

        <ul>
          <li>All notification triggers that use this email template</li>
        </ul>

        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingEmailTemplate" @click="cancelDeleteEmailTemplate()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingEmailTemplate" @click="deleteEmailTemplate()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import EmailTemplate from '@/models/email-template'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadEmailTemplate' })

export default {
  name: 'ShowEmailTemplate',
  mixins: [ResourcePageMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      emailTemplate: EmailTemplate.objectWithDefaults(),
      isLoading: false,

      isConfirmingDeleteEmailTemplate: false,
      isDeletingEmailTemplate: false,

      errors: {}
    }
  },
  created () {
    this.loadEmailTemplate()
  },
  methods: {
    loadEmailTemplate () {
      return freshcom.retrieveEmailTemplate(this.id).then(response => {
        this.emailTemplate = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    deleteEmailTemplate () {
      this.isDeletingEmailTemplate = true

      freshcom.deleteEmailTemplate(this.emailTemplate.id).then(() => {
        this.isDeletingUnlockable = false
        this.$message({
          showClose: true,
          message: `Email template deleted successfully.`,
          type: 'success'
        })

        this.back()
      }).catch(() => {
        this.isDeletingUnlockable = false
      })
    },

    attemptDeleteEmailTemplate () {
      this.isConfirmingDeleteEmailTemplate = true
    },

    cancelDeleteEmailTemplate () {
      this.isConfirmingDeleteEmailTemplate = false
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListEmailTemplate' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body-html-preview iframe {
  width: 100%;
  height: 800px;
  border: none;
}
</style>
