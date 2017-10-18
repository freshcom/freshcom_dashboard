<template>
<el-dialog title="Edit Line Item" :show-close="false" :visible="isVisible" class="fixed-width">
  <order-line-item-form v-model="recordDraft"></order-line-item-form>

  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">Cancel</el-button>
    <el-button @click="save" type="primary">Save</el-button>
  </div>
</el-dialog>
</template>

<script>
import _ from 'lodash'
import { dollar } from '@/helpers/filters'
import PriceAmountInput from '@/components/price-amount-input'
import OrderLineItemForm from '@/components/order-line-item-form'

export default {
  name: 'OrderLineItemDialog',
  props: ['value', 'errors', 'isVisible'],
  components: {
    PriceAmountInput,
    OrderLineItemForm
  },
  filters: {
    dollar
  },
  data () {
    return {
      recordDraft: _.cloneDeep(this.value)
    }
  },
  watch: {
    value (v) {
      this.recordDraft = _.cloneDeep(v)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.recordDraft)
    }
  }
}
</script>


<style scoped>
.el-form-item {
  display: inline-block;
  margin: 10px 0px;
}

.el-form-item.order-quantity .el-input-number {
  width: 120px;
}

.el-form-item.charge-quantity .el-input {
  width: 100px;
}

.el-form-item.charge-price .el-input {
  width: 100px;
}

.el-form-item.charge-price .el-tag, .el-form-item.tax .el-tag, .el-form-item.sub-total-left .el-tag, .el-form-item.grand-total .el-tag {
  font-size: 18px;
  padding: 6px 15px;
  height: 36px;
}

.el-form-item.sub-total-right, .el-form-item.grand-total {
  float: right;
}

.el-form-item.sub-total-right .el-input {
  width: 120px;
}
</style>
