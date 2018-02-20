<template>
<el-table
  @expand-change="lineItemExpanded"
  :data="tableData"
  :expand-row-keys="expandedLineItemIds"
  row-key="id"
  class="nested-block-table column-compact"
  style="width: 100%"
>
  <el-table-column type="expand" width="30px">
    <template slot-scope="props">
      <el-table :data="props.row.children" :show-header="false" style="width: 100%">
        <el-table-column width="30px"></el-table-column>
        <el-table-column width="250px" label="Name" prop="name"></el-table-column>
        <el-table-column width="120px" label="Qty" prop="orderQuantity"></el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </template>
  </el-table-column>
  <el-table-column label="Name" prop="name">
    <template slot-scope="scope">
      <span>{{scope.row.name}}</span>
      <el-tag size="mini" type="info" class="m-l-10">
        {{$t(`fields.orderLineItem.fulfillmentStatus.${scope.row.fulfillmentStatus}`)}}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column width="100px" label="Qty" prop="quantity"></el-table-column>
  <el-table-column width="80px" label="ST Amt." prop="subTotal" align="right"></el-table-column>
  <el-table-column width="80px" label="Tax" prop="taxTotal" align="right"></el-table-column>
  <el-table-column width="80px" label="GT Amt." prop="grandTotal" align="right"></el-table-column>

  <el-table-column width="120">
    <template slot-scope="scope">
      <p class="text-right actions">
        <el-button @click="editLineItem(scope.row.id)" plain size="mini">
          Edit
        </el-button>

        <confirm-button @confirmed="deleteLineItem(scope.row.id)" size="mini">
          Delete
        </confirm-button>
      </p>
    </template>
  </el-table-column>
</el-table>

</template>

<script>
import _ from 'lodash'
import OrderLineItem from '@/models/order-line-item'
import ConfirmButton from '@/components/confirm-button'

export default {
  name: 'OrderLineItemTable',
  props: ['records'],
  components: {
    ConfirmButton
  },
  data: function () {
    return {
      expandedLineItemIds: []
    }
  },
  computed: {
    tableData () {
      return OrderLineItem.tableData(this.records)
    }
  },
  methods: {
    lineItemExpanded (row) {
      if (row.children && (row.children.length > 0) && !_.includes(this.expandedLineItemIds, row.id)) {
        this.expandedLineItemIds = [row.id]
        return
      }
      this.expandedLineItemIds = []
    },

    deleteLineItem (lineItemId) {
      this.$emit('delete', lineItemId)
    },

    editLineItem (lineItemId) {
      this.$emit('edit', lineItemId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
