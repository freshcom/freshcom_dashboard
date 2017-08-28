<template>

<!-- <popup v-model="show" height="100%">
  <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="0px">
    <x-header slot="header" :left-options="{ showBack: false }" class="fixed-header">
      File Manager
      <a href="javascript:;" slot="right" @click="done">Select</a>
      <a href="javascript:;" slot="right" @click="done">Done</a>
    </x-header>


    <flexbox :gutter="0" class="h-fvp">
      <flexbox-item class="h-fvp vux-1px-r">
        <group title="File Sets">
          <cell v-for="fileSet in fileSets" :key="fileSet.label" :title="$t(`models.externalFileSet.label.${fileSet.label}`)" :class="{ active: isFileSetSelected(fileSet) }" @click.native="selectFileSet(fileSet)" is-link></cell>
        </group>
      </flexbox-item>
      <flexbox-item :span="8" class="h-fvp scroll-y">
        <div class="vtw">
          <group title="Files">
            <div class="weui-uploader preview" style="padding:15px;">
              <div class="weui-uploader__bd">
                <ul class="weui-uploader__files" id="uploaderFiles">
                    <li class="weui-uploader__file" style="background-image:url(https://static.vux.li/uploader_bg.png)"></li>
                    <li class="weui-uploader__file" style="background-image:url(https://static.vux.li/uploader_bg.png)"></li>
                    <li class="weui-uploader__file" style="background-image:url(https://static.vux.li/uploader_bg.png)"></li>

                    <li class="weui-uploader__file weui-uploader__file_status" style="background-image:url(https://static.vux.li/uploader_bg.png)">
                        <div class="weui-uploader__file-content">
                            <i class="weui-icon-warn"></i>
                        </div>
                    </li>
                    <li class="weui-uploader__file weui-uploader__file_status" style="background-image:url(https://static.vux.li/uploader_bg.png)">
                        <div class="weui-uploader__file-content">50%</div>
                    </li>
                    <li v-for="externalFile in pendingExternalFiles" :key="externalFile.id" class="weui-uploader__file weui-uploader__file_status" style="background-image:url(https://static.vux.li/uploader_bg.png)">
                        <div class="weui-uploader__file-content">{{externalFile.percentage}}%</div>
                    </li>
                    <li v-for="externalFile in uploadedExternalFiles" :key="externalFile.id" class="weui-uploader__file">
                      <img :src="externalFile.presignedUrl" style="height: 79px; width: 79px;">
                    </li>
                </ul>
                <div class="weui-uploader__input-box">
                    <input @change="pushPendingImage" class="weui-uploader__input" type="file" accept="image/*" multiple />
                </div>
              </div>
            </div>
          </group>
        </div>
      </flexbox-item>
    </flexbox>
  </view-box>
</popup> -->

</template>


<script>
import _ from 'lodash'

export default {
  name: 'FileSetManager',
  props: {
    value: {
      type: Array
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedFileSet: this.value[0],
      targetLocale: 'en',
      fileSets: this.value
    }
  },
  computed: {
    pendingExternalFiles() {
      return this.$store.state.pendingExternalFiles
    },
    uploadedExternalFiles() {
      return this.$store.state.uploadedExternalFiles
    }
  },
  watch: {
    value(v) {
      this.fileSets = v
      this.selectedFileSet = this.value[0]
    },
    uploadedExternalFiles(collection) {
      // If there is still externalFile being uploaded we wait until
      // all is finished
      if (this.pendingExternalFiles.length > 0) {
        return
      }

      let uploadedByFileSets = {}
      _.forEach(collection, (externalFile) => {
        let fileSet = externalFile.fileSet
        uploadedByFileSets[fileSet.label] = uploadedByFileSets[fileSet.label] || []
        uploadedByFileSets[fileSet.label].push(externalFile)
      })

      this.$store.dispatch('popUploadedExternalFile', collection)
      _.forEach(uploadedByFileSets, (externalFiles, fileSet) => {
        this.$store.dispatch('createExternalFileSet', fileSet).then(fileSet => {
          return this.$store.dispatch('addFileToExternalFileSet', externalFiles)
        })
      })
    }
  },
  methods: {
    done() {
      this.$emit('done')
    },
    selectFileSet(fileSet) {
      this.selectedFileSet = fileSet
    },
    isFileSetSelected(fileSet) {
      return this.selectedFileSet === fileSet
    },
    pushPendingImage(e) {
      let files = e.target.files || []
      let externalFileCollection = _.map(files, (file) => {
        return { type: 'ExternalFile', name: file.name, sizeBytes: file.size, contentType: file.type, file: file, fileSet: this.selectedFileSet }
      })

      if (!_.isEmpty(externalFileCollection)) {
        this.$store.dispatch('pushPendingExternalFile', externalFileCollection)
      }
    }
  }
}
</script>
