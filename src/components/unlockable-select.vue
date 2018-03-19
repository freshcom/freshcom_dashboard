<template>
  <div class="component-wrapper unlockable-select">
    <div v-show="isEditing" class="resource-editor">
      <remote-select
        :value="draft"
        :search-method="searchUnlockable"
        :record-to-option="unlockableToOption"
        @change="unlockableChangeHandler($event)"
        placeholder="Search..."
      >
      </remote-select>

      <div v-if="hasExistingValue" class="action-group">
        <el-button @click="cancelEdit()" plain size="mini">Cancel</el-button>
      </div>
    </div>
    <div v-show="!isEditing" class="resource-block medium">
      <div class="resource">
        <p class="primary">
          <span v-if="value.code">[{{value.code}}]</span>
          <span>{{value.name}}</span>
        </p>
        <p class="secondary">{{value.id}}</p>
      </div>

      <div v-if="!disabled" class="action-group">
        <el-button @click="edit()" plain size="mini">Edit</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'
import RemoteSelect from '@/components/remote-select'

export default {
  name: 'UnlockableSelect',
  components: {
    RemoteSelect
  },
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isEditing: _.isEmpty(this.value),
      draft: {}
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

    searchUnlockable (keyword) {
      return freshcom.listUnlockable({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    unlockableChangeHandler (unlockable) {
      this.$emit('input', unlockable)
      this.draft = {}
    },

    unlockableToOption (unlockable) {
      if (!unlockable) {
        return { value: undefined }
      }

      let info = ''
      if (unlockable.code) {
        info += `[${unlockable.code}] `
      }
      info += unlockable.name + ' :: ' + unlockable.status
      return { value: unlockable.id, label: info }
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
