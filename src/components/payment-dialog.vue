<template>
<el-dialog :title="title" :show-close="false" :visible="isVisible" v-bind:class="{'fw-sm': record.id, 'fw-lg': !record.id}">
  <payment-form
    v-model="formModel"
    :record="record"
    :errors="errors"
  >

  </payment-form>

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
import PaymentForm from '@/components/payment-form'

export default {
  name: 'PaymentDialog',
  props: ['value', 'errors', 'isVisible', 'title', 'record'],
  components: {
    PriceAmountInput,
    PaymentForm
  },
  filters: {
    dollar
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.formModel)
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
