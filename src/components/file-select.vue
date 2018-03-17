<template>
  <div class="component-wrapper file-select">
    <div v-show="isEditing" class="resource-editor">
      <remote-select
        :value="draft"
        :search-method="searchFile"
        :record-to-option="fileToOption"
        @change="fileChangeHandler($event)"
        placeholder="Search..."
      >
      </remote-select>

      <div v-if="hasExistingValue" class="action-group">
        <el-button @click.native="cancelEdit()" plain size="mini">Cancel</el-button>
      </div>
    </div>
    <div v-show="!isEditing" class="resource-block medium">
      <div class="resource">
        <p class="primary">{{value.name}}</p>
        <p class="secondary">{{value.id}}</p>
      </div>

      <div class="action-group">
        <el-button @click.native="edit()" plain size="mini">Edit</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'
import RemoteSelect from '@/components/remote-select'

export default {
  name: 'FileSelect',
  components: {
    RemoteSelect
  },
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      isEditing: _.isEmpty(this.value),
      draft: _.cloneDeep(this.value)
    }
  },
  watch: {
    value (v) {
      if (_.isEmpty(v)) {
        this.isEditing = true
      } else {
        this.isEditing = false
      }
    }
  },
  computed: {
    hasExistingValue () {
      return !_.isEmpty(this.value)
    }
  },
  methods: {
    edit () {
      this.isEditing = true
    },

    cancelEdit () {
      this.isEditing = false
    },

    searchFile (keyword) {
      return freshcom.listFile({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    fileChangeHandler (file) {
      this.$emit('input', file)
      this.draft = {}
    },

    fileToOption (file) {
      if (!file) {
        return { value: undefined }
      }

      let info = ''
      if (file.code) {
        info += `[${file.code}] `
      }
      info += file.name + ' :: ' + file.status
      return { value: file.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.editor {
  display: inline-block;
}
</style>
