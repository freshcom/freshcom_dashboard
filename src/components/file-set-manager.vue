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
          <cell v-for="fileSet in fileSets" :key="fileSet.label" :title="$t(`models.fFileSet.label.${fileSet.label}`)" :class="{ active: isFileSetSelected(fileSet) }" @click.native="selectFileSet(fileSet)" is-link></cell>
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
                    <li v-for="fFile in pendingFiles" :key="fFile.id" class="weui-uploader__file weui-uploader__file_status" style="background-image:url(https://static.vux.li/uploader_bg.png)">
                        <div class="weui-uploader__file-content">{{fFile.percentage}}%</div>
                    </li>
                    <li v-for="fFile in uploadedFiles" :key="fFile.id" class="weui-uploader__file">
                      <img :src="fFile.presignedUrl" style="height: 79px; width: 79px;">
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
    pendingFiles() {
      return this.$store.state.pendingFiles
    },
    uploadedFiles() {
      return this.$store.state.uploadedFiles
    }
  },
  watch: {
    value(v) {
      this.fileSets = v
      this.selectedFileSet = this.value[0]
    },
    uploadedFiles(collection) {
      // If there is still fFile being uploaded we wait until
      // all is finished
      if (this.pendingFiles.length > 0) {
        return
      }

      let uploadedByFileSets = {}
      _.forEach(collection, (fFile) => {
        let fileSet = fFile.fileSet
        uploadedByFileSets[fileSet.label] = uploadedByFileSets[fileSet.label] || []
        uploadedByFileSets[fileSet.label].push(fFile)
      })

      this.$store.dispatch('popUploadedFile', collection)
      _.forEach(uploadedByFileSets, (fFiles, fileSet) => {
        this.$store.dispatch('createFileSet', fileSet).then(fileSet => {
          return this.$store.dispatch('addFileToFileSet', fFiles)
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
      let fileCollection = _.map(files, (file) => {
        return { type: 'File', name: file.name, sizeBytes: file.size, contentType: file.type, file: file, fileSet: this.selectedFileSet }
      })

      if (!_.isEmpty(fileCollection)) {
        this.$store.dispatch('pushPendingFile', fileCollection)
      }
    }
  }
}
</script>
