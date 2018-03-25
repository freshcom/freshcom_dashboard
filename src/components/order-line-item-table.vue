<template>
<el-table :data="tableData" class="data-table block-table column-compact">
  <el-table-column type="expand" width="30px">
    <template slot-scope="props">
      <el-table :data="props.row.children" :show-header="false" class="data-table block-table">
        <el-table-column width="50px"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <a href="javascript:;">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column width="100px" prop="orderQuantity"></el-table-column>
        <el-table-column width="340px"></el-table-column>
      </el-table>
    </template>
  </el-table-column>

  <el-table-column label="Name">
    <template slot-scope="scope">
      <a href="javascript:;" class="primary">
        <span>{{scope.row.name}}</span>
        <el-tag size="mini" type="info" class="m-l-10">
          {{$t(`fields.orderLineItem.fulfillmentStatus.${scope.row.fulfillmentStatus}`)}}
        </el-tag>
      </a>
    </template>
  </el-table-column>

  <el-table-column width="100px" label="Qty" prop="quantity"></el-table-column>

  <el-table-column width="80px" label="ST Amt." prop="subTotal" align="right"></el-table-column>

  <el-table-column width="80px" label="Tax" prop="taxTotal" align="right"></el-table-column>

  <el-table-column width="80px" label="GT Amt." prop="grandTotal" align="right"></el-table-column>

  <el-table-column align="right" width="120">
    <template slot-scope="scope">
      <p class="action-group">
        <el-button-group>
          <el-button @click="editLineItem(scope.row.id)" plain size="mini">
            Edit
          </el-button>

          <confirm-button @confirmed="deleteLineItem(scope.row.id)" size="mini">
            Delete
          </confirm-button>
        </el-button-group>
      </p>
    </template>
  </el-table-column>
</el-table>
</template>

<script>
import OrderLineItem from '@/models/order-line-item'
import ConfirmButton from '@/components/confirm-button'

export default {
  name: 'OrderLineItemTable',
  props: ['records'],
  components: {
    ConfirmButton
  },
  computed: {
    tableData () {
      return OrderLineItem.tableData(this.records)
    }
  },
  methods: {
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
