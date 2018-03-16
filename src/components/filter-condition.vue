<template>
  <div class="component-wrapper filter-condition">
    <div class="key">
      <label :for="elementId">
        <input :checked="checked" :id="elementId" @change="toggleValue()" type="checkbox">
        <slot name="key"></slot>
      </label>
    </div>

    <div v-show="checked" class="value">
      <slot name="value"></slot>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'FilterCondition',
  props: {
    filterKey: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    default: {
      type: [String, Array],
      required: true
    }
  },
  computed: {
    elementId () {
      if (this.filterKey) {
        return `filter-${this.filterKey}`
      } else {
        return ''
      }
    },

    checked () {
      if (this.filterKey && this.value) {
        return this.filterKey in this.value
      } else {
        return false
      }
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    }
  },
  methods: {
    toggleValue () {
      if (this.filterKey in this.value) {
        let updatedFilter = _.omit(this.value, this.filterKey)
        this.$emit('input', updatedFilter)
      } else {
        let updatedFilter = _.merge({}, _.set(this.value, this.filterKey, this.default))
        this.$emit('input', updatedFilter)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.filter-condition {
  &:first-child {
    .key {
      border: none;
    }
  }

  .key {
    padding: 5px 10px;
    border-top: 1px solid #ebeef5;
    font-size: 12px;

    .el-checkbox__label {
      font-weight: 400;
    }

    label {
      display: block;
    }
  }

  .value {
    padding: 10px;
    background-color: #eef1f6;

    select {
      height: 22px;
      width: 100%;
    }

    input {
      line-height: 12px;
      padding: 3px 4px;
    }
  }
}
</style>
