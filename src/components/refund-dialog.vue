<template>
<el-dialog :title="title" :show-close="false" :visible="isVisible" class="fw-sm">
  <el-form :model="formModel">
    <el-form-item :error="errorMessages.amountCents" label="Refund Amount" class="refund-amount">
      <price-amount-input v-model="formModel.amountCents"></price-amount-input>
    </el-form-item>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">Cancel</el-button>
    <el-button @click="refund" type="primary">Refund</el-button>
  </div>
</el-dialog>
</template>

<script>
import _ from 'lodash'
import { dollar } from '@/helpers/filters'
import PriceAmountInput from '@/components/price-amount-input'
import errorI18nKey from '@/utils/error-i18n-key'

export default {
  name: 'RefundDialog',
  props: ['value', 'errors', 'isVisible', 'title'],
  components: {
    PriceAmountInput
  },
  filters: {
    dollar
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('payment', k, v[0]), { name: _.startCase(k) })
        return result
      }, {})
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
    refund () {
      this.$emit('refund', this.formModel)
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
