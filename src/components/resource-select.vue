<template>
<div class="component-wrapper resource-select">
  <div v-show="isEditing" class="resource-editor">
    <remote-select
      :value="draft"
      :search-method="searchMethod"
      :record-to-option="recordToOption"
      :class="[size]"
      @change="handleResourceChange($event)"
      placeholder="Search..."
    >
    </remote-select>

    <div v-if="hasExistingValue" :class="[size]" class="action-group">
      <el-button @click="cancelEdit()" plain size="mini">Cancel</el-button>
    </div>
  </div>
  <div v-show="!isEditing" :class="[size]" class="resource-block">
    <div class="resource">
      <p class="primary">
        <span v-if="value.code">[{{value.code}}]</span>
        <span>{{value.name}}</span>
      </p>
      <p v-if="size !== 'small'" class="secondary">{{value.id}}</p>
    </div>

    <div v-if="!disabled" class="action-group">
      <el-button @click="edit()" plain size="mini">Edit</el-button>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import RemoteSelect from '@/components/remote-select'

export default {
  name: 'ResourceSelect',
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
    },
    searchMethod: {
      type: Function,
      required: true
    },
    recordToOption: {
      type: Function,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
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

    handleResourceChange (resource) {
      this.$emit('input', resource)
      this.draft = {}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.el-select.small {
  max-width: 180px;
}

.action-group.small {
  margin-left: 0px;
}
</style>
