<template>
<el-form :model="formModel" @input.native="updateValue" label-width="150px" size="small">
  <div class="file-uploader">
    <el-upload :http-request="uploadAvatar" action="" :show-file-list="false">
      <img v-if="avatarUrl" :src="avatarUrl" class="file">
      <i v-else class="el-icon-plus file-uploader-icon"></i>
    </el-upload>
    <el-progress v-if="pendingAvatar" :show-text="false" :percentage="pendingAvatar.percentage"></el-progress>
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

  <el-form-item label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item label="Print Name" :error="errorMsgs.printName" required>
    <el-input v-model="formModel.printName"></el-input>
  </el-form-item>

  <el-form-item label="Unit Of Measure" :error="errorMsgs.unitOfMeasure" required>
    <el-input v-model="formModel.unitOfMeasure" width="200px"></el-input>
  </el-form-item>

  <el-form-item label="Variable Weight" :error="errorMsgs.variableWeight" required>
    <el-switch
      @change="updateValue"
      v-model="formModel.variableWeight"
      on-text="Yes"
      off-text="No">
    </el-switch>
  </el-form-item>

  <hr>

  <el-form-item label="Storage Type" :error="errorMsgs.storageType">
    <el-select @change="updateValue" v-model="formModel.storageType" placeholder="Select Storage Type">
      <el-option label="Room" value="room"></el-option>
      <el-option label="Frozen" value="frozen"></el-option>
      <el-option label="Refrigerated" value="refrigerated"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Stackable" :error="errorMsgs.stackable" required>
    <el-switch
      @change="updateValue"
      v-model="formModel.stackable"
      on-text="Yes"
      off-text="No">
    </el-switch>
  </el-form-item>

  <el-form-item label="Storage Size" :error="errorMsgs.storageSize" required>
    <el-input-number v-model="formModel.storageSize" :min="0" :step="100"></el-input-number>
  </el-form-item>

  <el-form-item label="Storage Description">
    <el-input type="textarea" v-model="formModel.storageDescription"></el-input>
  </el-form-item>

  <hr>

  <el-form-item label="Specification">
    <el-input type="textarea" v-model="formModel.specification"></el-input>
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
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'StockableForm',
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      imageUrl: '',
      pendingAvatarId: ''
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'stockable')
    },
    avatarUrl () {
      if (!this.formModel.avatar) {
        return
      }

      if (this.formModel.avatar.status === 'uploaded') {
        return this.formModel.avatar.url
      }

      return URL.createObjectURL(this.formModel.avatar.file)
    },
    pendingAvatar () {
      return _.find(this.$store.state.externalFile.pendingRecords, (externalFile) => { return externalFile.id === this.pendingAvatarId })
    },
    uploadedAvatar () {
      return _.find(this.$store.state.externalFile.uploadedRecords, (externalFile) => { return externalFile.id === this.pendingAvatarId })
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    },
    uploadedAvatar (externalFile) {
      if (!externalFile) {
        return
      }

      this.$store.dispatch('externalFile/popUploadedRecords', [externalFile])
      this.formModel = _.merge({}, this.formModel, { avatar: externalFile })
      this.updateValue()
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    beforeAvatarUpload () {

    },
    handleAvatarSuccess () {

    },
    uploadAvatar (e) {
      let file = e.file
      let externalFile = { type: 'ExternalFile', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }
      this.$store.dispatch('externalFile/pushPendingRecords', [externalFile]).then(externalFiles => {
        this.pendingAvatarId = externalFiles[0].id
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
