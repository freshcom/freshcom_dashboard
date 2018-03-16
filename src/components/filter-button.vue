<template>
<div class="component-wrapper filter-button">
  <el-popover v-model="isPopoverVisible" :visible-arrow="false" @hide="cancel()" ref="filter" placement="bottom-start" width="240" trigger="click" popper-class="filter">
    <form @submit.prevent="done()">
      <el-row class="header">
        <el-col :span="8">
          <el-button @click="clear()" size="mini" plain>Clear</el-button>
        </el-col>

        <el-col :span="8" class="text-center">
          <p>Filters</p>
        </el-col>

        <el-col :span="8" class="text-right">
          <el-button size="mini" type="primary" native-type="submit">Done</el-button>
        </el-col>
      </el-row>

      <slot></slot>
    </form>
  </el-popover>

  <el-button v-popover:filter plain size="small" class="cta">
    <div class="text">
      <icon name="filter" scale="0.7" class="v-middle"></icon>
      <span>Filter</span>
    </div>
    <div class="indicator" v-if="activeFilterCount > 0">
      <span class="active-filter-count">{{activeFilterCount}}</span>
    </div>
  </el-button>
</div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'FilterButton',
  props: {
    current: {
      type: Object,
      required: true
    },
    draft: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPopoverVisible: false,
      isDone: false
    }
  },
  computed: {
    activeFilterCount () {
      return _.keys(this.current).length
    }
  },
  methods: {
    done () {
      this.isDone = true
      this.isPopoverVisible = false
      this.setFilter()
    },

    cancel () {
      if (!this.isDone) {
        this.$emit('cancel')
      }
      this.isDone = false
    },

    clear () {
      this.$emit('clear')
    },

    setFilter () {
      let q
      if (_.isEmpty(this.draft)) {
        q = _.omit(this.$route.query, ['filter', 'page'])
      } else {
        q = _.omit(this.$route.query, 'page')
        q.filter = this.draft
      }

      this.$router.replace({ name: this.$route.name, query: q })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.filter-button {
  display: inline-block;
  width: 105px;

  .active-filter-count {
    color: #409EFF;
    font-weight: 600;
  }

  .cta {
    padding: 3px 15px;

    .text {
      display: inline-block;
      padding: 6px 0px;
    }

    .indicator {
      border-left: 1px solid #dcdfe6;
      display: inline-block;
      margin-left: 9px;
      padding: 6px 0px 6px 9px;
    }
  }
}

.el-popover.filter {
  .header {
    padding: 6px 12px;
    background-color: #eef1f6;

    .el-button {
      font-size: 12px;
      padding: 4px 8px;
    }

    p {
      font-weight: 500;
      margin: 0;
    }
  }
}
</style>


<style lang="scss">
// We have to use global style here because the
// actual popover container is outside the scope
.el-popover.filter {
  padding: 0px;
}
</style>
