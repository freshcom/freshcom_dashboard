<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/sms" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListSms' }" index="/sms">
        SMS
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListSmsTemplate' }" index="/sms-templates">
        Templates
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <div class="brief">
      <div class="avatar">
        <icon name="file-code-o" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>SMS</span>
        </p>
        <h1>{{sms.to}}</h1>
        <p class="id">{{sms.id}}</p>
      </div>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
          <dl>
            <dt>ID</dt>
            <dd>{{sms.id}}</dd>

            <dt>To</dt>
            <dd>{{sms.to}}</dd>

            <dt>Body</dt>
            <dd>{{sms.body}}</dd>

            <dt>Locale</dt>
            <dd>{{sms.locale}}</dd>

            <dt>Last updated</dt>
            <dd>{{sms.updatedAt | moment}}</dd>

            <dt>Creation date</dt>
            <dd>{{sms.insertedAt | moment}}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadSms' })

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
      sms: {},
      isLoading: false,
      errors: {}
    }
  },
  created () {
    this.loadSms()
  },
  methods: {
    loadSms () {
      return freshcom.retrieveSms(this.id).then(response => {
        this.sms = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListSms' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.body-html-preview iframe {
  width: 100%;
  height: 800px;
  border: none;
}
</style>
