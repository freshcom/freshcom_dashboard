<template>
  <div class="component-wrapper email-template-fieldset">
    <el-form-item label="Name" :error="errorMsgs.name" required>
      <el-input v-model="formModel.name" @input="updateValue"></el-input>
    </el-form-item>

    <el-form-item label="Description">
      <el-input type="textarea" v-model="formModel.description" @input="updateValue"></el-input>
    </el-form-item>

    <el-form-item label="To" :error="errorMsgs.to" required>
      <el-input v-model="formModel.to" @input="updateValue"></el-input>
    </el-form-item>

    <el-form-item label="Reply To" :error="errorMsgs.replyTo">
      <el-input v-model="formModel.replyTo" @input="updateValue"></el-input>
    </el-form-item>

    <el-form-item label="Subject" :error="errorMsgs.subject" required>
      <el-input v-model="formModel.subject" @input="updateValue"></el-input>
    </el-form-item>

    <el-row>
      <el-col :span="24" class="content-input">
        <p class="text-center">Code</p>
        <codemirror v-model="formModel.contentHtml" :options="cmOptions" @input="updateValue"></codemirror>
      </el-col>

      <el-col :span="24" class="content-preview">
        <p class="text-center">Preview</p>
        <iframe :srcdoc="formModel.contentHtml"></iframe>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/xml/xml'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/handlebars/handlebars'

import 'codemirror/lib/codemirror.css'

import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'EmailTemplateFieldset',
  components: {
    codemirror
  },
  props: ['value', 'errors'],
  data () {
    return {
      amount: this.value.amount,
      formModel: _.cloneDeep(this.value),
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
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'emailTemplate')
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.content-input {
  width: 50%;
}
.content-preview {
  width: 50%;

  iframe {
    width: 100%;
    height: 800px;
    border: none;
  }
}
</style>
