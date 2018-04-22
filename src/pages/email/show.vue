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
          <span>Email</span>
        </p>
        <h1>{{email.subject}}</h1>
        <p class="id">{{email.id}}</p>
      </div>
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
            <dd>{{email.id}}</dd>

            <dt>Subject</dt>
            <dd>{{email.subject}}</dd>

            <dt>From</dt>
            <dd>{{email.from}}</dd>

            <dt>Reply To</dt>
            <dd>{{email.reployTo}}</dd>

            <dt>To</dt>
            <dd>{{email.to}}</dd>

            <dt>Locale</dt>
            <dd>{{email.locale}}</dd>

            <dt>Last updated</dt>
            <dd>{{email.updatedAt | moment}}</dd>

            <dt>Creation date</dt>
            <dd>{{email.insertedAt | moment}}</dd>
          </dl>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="center" @tab-click="handleBodyTabClick">
        <el-tab-pane style="height: 800px;" label="Body (HTML)" name="html">
          <codemirror ref="htmlEditor" v-model="email.bodyHtml" :options="cmOptions" @input="updateValue()"></codemirror>
        </el-tab-pane>

        <el-tab-pane label="Body (HTML Preview)" name="html-preview">
          <div class="body-html-preview">
            <iframe :srcdoc="email.bodyHtml"></iframe>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Body (Text)" name="text">
          <codemirror ref="textEditor" v-model="email.bodyText" :options="cmOptions" @input="updateValue()"></codemirror>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="foot text-right">
      <el-button plain size="small">Delete</el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import freshcom from '@/freshcom-sdk'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadEmail' })

export default {
  name: 'ShowEmailTemplate',
  mixins: [ResourcePageMixin],
  components: {
    codemirror
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      email: {},
      isLoading: false,
      errors: {},
      activeTab: 'html-preview',
      cmOptions: {
        // codemirror options
        tabSize: 2,
        mode: { name: 'handlebars', base: 'text/html' },
        theme: 'monokai',
        lineNumbers: true,
        line: true,
        readOnly: 'nocursor'
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  created () {
    this.loadEmail()
  },
  methods: {
    handleBodyTabClick () {
      setTimeout(() => {
        this.$refs.htmlEditor.codemirror.refresh()
        this.$refs.textEditor.codemirror.refresh()
      })
    },

    loadEmail () {
      return freshcom.retrieveEmail(this.id).then(response => {
        this.email = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListEmail' })
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
