<template>
<el-table
  @expand="lineItemExpanded"
  :data="tableData"
  :expand-row-keys="expandedLineItemIds"
  row-key="id"
  class="nested-table"
  style="width: 100%"
>
  <el-table-column type="expand" width="30px">
    <template slot-scope="props">
      <el-table :data="props.row.children" :show-header="false" style="width: 100%">
        <el-table-column width="40px" label="" prop=""></el-table-column>
        <el-table-column width="260px" label="Name" prop="name"></el-table-column>
        <el-table-column width="120px" label="Qty" prop="orderQuantity"></el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </template>
  </el-table-column>
  <el-table-column width="260px" label="Name" prop="name"></el-table-column>
  <el-table-column width="120px" label="Qty" prop="quantity"></el-table-column>
  <el-table-column width="200px" label="Sub | Tax | Grand" prop="amount" header-align="right" align="right"></el-table-column>

  <el-table-column label="">
    <template slot-scope="scope">
      <el-button @click="editLineItem(scope.row.id)" size="mini">
        <icon name="pencil" scale="0.8" class="v-middle"></icon>
      </el-button>
      <delete-button @confirmed="deleteLineItem(scope.row.id)" size="mini">
        <icon name="times" scale="0.8" class="v-middle"></icon>
      </delete-button>
    </template>
  </el-table-column>
</el-table>

</template>

<script>
import _ from 'lodash'
import OrderLineItem from '@/models/order-line-item'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'OrderLineItemTable',
  props: ['records'],
  components: {
    DeleteButton
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
