<template>
<div class="component-wrapper avatar-input">
  <el-upload :http-request="uploadAvatar" action="" :show-file-list="false" class="uploader">
    <img v-if="avatarUrl" :src="avatarUrl" class="preview">
    <div v-else class="uploader-icon-wrapper">
      <i class="el-icon-plus"></i>
    </div>
  </el-upload>
  <el-progress v-if="isUploading" :show-text="false" :percentage="avatar.percentage"></el-progress>
</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

export default {
  name: 'AvatarInput',
  props: ['value'],
  data () {
    return {
      avatar: _.cloneDeep(this.value),
      isUploading: false
    }
  },
  computed: {
    avatarUrl () {
      if (!this.value) {
        return
      }

      if (this.value.status === 'uploaded') {
        return this.value.url
      }

      return URL.createObjectURL(this.avatar.file)
    }
  },
  watch: {
    value (v) {
      this.avatar = _.cloneDeep(v)
    }
  },
  methods: {
    uploadAvatar (e) {
      let file = e.file
      let fFile = { type: 'File', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }

      freshcom.uploadFile(fFile, {}, {
        created: (response) => {
          this.avatar = _.merge({}, response.data, { percentage: 0, file: file })
          this.isUploading = true
        },
        progress: _.throttle((percentage) => {
          this.avatar.percentage = percentage
        }, 300)
      }).then(response => {
        let fFile = response.data
        this.avatar = fFile
        this.$emit('input', this.avatar)
        this.isUploading = false
      }).catch(() => {
        this.isUploading = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.avatar-input {
  text-align: center;

  .uploader {
    margin: 0 auto;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
  }

  .uploader:hover {
    border-color: #20a0ff;
  }

  .uploader-icon-wrapper {
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .preview {
    width: 150px;
    height: 150px;
    display: block;
  }

  .el-progress {
    width: 150px;
    display: inline-block;
    text-align: center;
  }
}
</style>
