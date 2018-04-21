<template>
  <div class="component-wrapper email-template-fieldset">
    <el-form-item label="Name" :error="errorMsgs.name" required>
      <el-input v-model="formModel.name" @input="updateValue()"></el-input>
    </el-form-item>

    <el-form-item label="Description">
      <el-input type="textarea" v-model="formModel.description" @input="updateValue()"></el-input>
    </el-form-item>

    <el-form-item label="To" :error="errorMsgs.to" required>
      <el-input v-model="formModel.to" @input="updateValue()"></el-input>
    </el-form-item>

    <el-form-item label="Reply To" :error="errorMsgs.replyTo">
      <el-input v-model="formModel.replyTo" @input="updateValue()"></el-input>
    </el-form-item>

    <el-form-item label="Subject" :error="errorMsgs.subject" required>
      <el-input v-model="formModel.subject" @input="updateValue()"></el-input>
    </el-form-item>

    <el-tabs v-model="activeTab" class="center" @tab-click="handleBodyTabClick">
      <p class="note">
        *We recommend editing your template using your own editor and save it locally then copy paste to here.
        If you try edit directly here be warned that if the browser crashes you will lose all your work.
      </p>

      <el-tab-pane label="Body (HTML)" name="html">
        <codemirror ref="htmlEditor" v-model="formModel.bodyHtml" :options="cmOptions" @input="updateValue()"></codemirror>
      </el-tab-pane>

      <el-tab-pane label="Body (HTML Preview)" name="html-preview">
        <div class="body-html-preview">
          <iframe :srcdoc="formModel.bodyHtml"></iframe>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Body (Text)" name="text">
        <codemirror ref="textEditor" v-model="formModel.bodyText" :options="cmOptions" @input="updateValue()"></codemirror>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/xml/xml'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/handlebars/handlebars'
import 'codemirror/lib/codemirror.css'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'emailTemplate' })

export default {
  name: 'EmailTemplateFieldset',
  mixins: [FieldsetMixin],
  components: {
    codemirror
  },
  data () {
    return {
      activeTab: 'html',
      cmOptions: {
        // codemirror options
        tabSize: 2,
        mode: { name: 'handlebars', base: 'text/html' },
        theme: 'monokai',
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  methods: {
    handleBodyTabClick () {
      setTimeout(() => {
        this.$refs.htmlEditor.codemirror.refresh()
        this.$refs.textEditor.codemirror.refresh()
      })
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

.note {
  margin-top: 0px;
  font-size: 12px;
}
</style>
