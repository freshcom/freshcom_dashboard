<template>
<el-form :model="formModel" @input.native="updateValue" label-width="150px" size="small">
  <div class="file-uploader">
    <el-upload :http-request="uploadAvatar" action="" :show-file-list="false">
      <img v-if="avatarUrl" :src="avatarUrl" class="file">
      <i v-else class="el-icon-plus file-uploader-icon"></i>
    </el-upload>
    <el-progress v-if="isUploadingAvatar" :show-text="false" :percentage="formModel.avatar.percentage"></el-progress>
  </div>

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Active" value="active"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Target Type" :error="errorMsgs.targetType" required>
    <el-select @change="updateValue" v-model="formModel.targetType">
      <el-option label="Point Account" value="PointAccount"></el-option>
      <el-option label="Custom" value="Custom"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Amount" :error="errorMsgs.amount" required>
    <el-input-number v-model="formModel.amount" :controls="false" :step="1" :min="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item label="Print Name" :error="errorMsgs.printName" required>
    <el-input v-model="formModel.printName"></el-input>
  </el-form-item>

  <el-form-item label="Caption">
    <el-input v-model="formModel.caption"></el-input>
  </el-form-item>

  <el-form-item label="Description">
    <el-input type="textarea" v-model="formModel.description"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'DepositableForm',
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      isUploadingAvatar: false
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'depositable')
    },

    avatarUrl () {
      if (!this.formModel.avatar) {
        return
      }

      if (this.formModel.avatar.status === 'uploaded') {
        return this.formModel.avatar.url
      }

      return URL.createObjectURL(this.formModel.avatar.file)
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
    }, 300),
    uploadAvatar (e) {
      let file = e.file
      let externalFile = { type: 'ExternalFile', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }

      freshcom.uploadExternalFile(externalFile, {}, {
        created: (response) => {
          this.formModel.avatar = _.merge({}, response.data, { percentage: 0, file: file })
          this.isUploadingAvatar = true
        },
        progress: _.throttle((percentage) => {
          this.formModel.avatar.percentage = percentage
        }, 300)
      }).then(response => {
        let externalFile = response.data
        this.formModel.avatar = externalFile
        this.updateValue()
        this.isUploadingAvatar = false
      }).catch(() => {
        this.isUploadingAvatar = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
