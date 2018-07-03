<template>
<el-tree :data="value" :expand-on-click-node="false" class="order-line-item-tree">
  <el-row slot-scope="{ node, data }" style="width: 100%;">
    <el-col :span="8">
      <span>{{data.name}}</span>
    </el-col>

    <el-col :span="4">
      x {{data.orderQuantity}}
    </el-col>

    <el-col :span="4 - node.level" class="text-right">
      {{data.subTotalCents | dollar}}
    </el-col>

    <el-col :span="8 + node.level" class="text-right">
      <span v-if="mode === 'detail'" class="m-r-20">
        {{$t(`fields.orderLineItem.fulfillmentStatus.${data.fulfillmentStatus}`)}}
      </span>

      <span class="m-r-10">
        <el-button type="text" size="mini">
          View
        </el-button>

        <el-button v-if="node.level === 1" @click="editLineItem(data)" type="text" size="mini">
          Edit
        </el-button>

        <el-button v-if="node.level === 1" @click="deleteLineItem(data)" type="text" size="mini">
          Delete
        </el-button>
      </span>
    </el-col>
  </el-row>
</el-tree>
</template>

<script>
import { dollar } from '@/helpers/filters'

export default {
  name: 'OrderLineItemTree',
  filters: {
    dollar
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      defaut: 'simple'
    }
  },
  methods: {
    deleteLineItem (lineItem) {
      this.$emit('delete', lineItem)
    },

    editLineItem (lineItem) {
      this.$emit('edit', lineItem)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.order-line-item-tree {
  .el-col {
    font-size: 14px;
    height: 39px;
    line-height: 39px;
  }

  .el-tree-node__content {
    height: 39px;
  }
}
</style>
