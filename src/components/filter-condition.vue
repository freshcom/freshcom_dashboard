<template>
  <div class="component-wrapper filter-condition">
    <div class="key">
      <label :for="elementId">
        <input :checked="checked" :id="elementId" @change="toggleValue()" type="checkbox">
        <slot name="key"></slot>
      </label>
    </div>

    <div v-show="checked" class="comparison">
      <slot name="comparison" :operator="statementOperator" :value="statementValue" :set-operator="setStatementOperator" :set-value="setStatementValue"></slot>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'FilterCondition',
  props: {
    statementKey: {
      type: String,
      required: true
    },
    value: { // Filter
      type: Array,
      required: true
    },
    default: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      statement: undefined,
      statementOperator: undefined,
      statementValue: undefined
    }
  },
  created () {
    this.setDataFromFilter(this.value)
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
      if (this.statementKey && this.value) {
        return this.statement
      } else {
        return false
      }
    }
  },
  watch: {
    value (filter) {
      this.setDataFromFilter(filter)
    }
  },
  methods: {
    setDataFromFilter (filter) {
      this.statement = _.find(filter, (statement) => {
        return _.cloneDeep(statement[this.statementKey])
      })

      if (this.statement) {
        let comparison = this.statement[this.statementKey]
        this.statementOperator = Object.keys(comparison)[0]
        this.statementValue = Object.values(comparison)[0]
      }
    },

    isKeyExist (filter, key) {
      return !!_.find(filter, (statement) => {
        return !!statement[key]
      })
    },

    removeStatement (filter, key) {
      return _.reject(filter, (statement) => {
        return !!statement[key]
      })
    },

    setStatement () {
      let filter = this.removeStatement(this.value, this.statementKey)
      this.$emit('input', _.concat(filter, this.statement))
    },

    toggleValue () {
      if (this.isKeyExist(this.value, this.statementKey)) {
        let filter = this.removeStatement(this.value, this.statementKey)
        this.$emit('input', filter)
      } else {
        let statement = {}
        statement[this.statementKey] = this.default
        this.$emit('input', _.concat(this.value, statement))
      }
    },

    setStatementOperator (operator) {
      this.statement = { [this.statementKey]: { [operator]: this.statementValue } }
      this.setStatement()
    },

    setStatementValue (value) {
      this.statement[this.statementKey][this.statementOperator] = value
      this.setStatement()
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

  .comparison {
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
