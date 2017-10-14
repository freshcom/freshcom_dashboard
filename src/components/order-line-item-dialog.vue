<template>
<el-dialog title="Edit Line Item" :show-close="false" :visible="isVisible" class="fixed-width">
  <el-form :model="formModel" label-position="top">
    <el-row>
      <p><b>Name: </b> {{formModel.name}}</p>
    </el-row>
    <el-row>
      <el-form-item>
        <span>Is Estimate?</span>
        <el-switch
          v-model="isEstimate"
          :disabled="!isIsEstimateTogglable"
          on-text="Yes"
          off-text="No">
        </el-switch>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="Order Quantity" class="order-quantity">
        <el-input-number v-model="orderQuantity" :min="1" :step="1"></el-input-number>
      </el-form-item>

      <span v-if="formModel.priceOrderUnit" class="m-r-20">{{formModel.priceOrderUnit}}</span>

      <span v-if="formModel.priceEstimateByDefault" class="m-r-20">=</span>

      <el-form-item v-if="formModel.priceEstimateByDefault" label="Charge Quantity" class="charge-quantity">
        <el-input v-model="chargeQuantity" @focus="$event.target.select()" type="number" class="charge-quantity-input"></el-input>
      </el-form-item>

      <span v-if="formModel.priceEstimateByDefault && formModel.priceChargeUnit" class="m-r-20">{{formModel.priceChargeUnit}}</span>

      <span class="m-r-20">x</span>

      <el-form-item label="Price" class="charge-price">
        <el-tag>{{formModel.priceChargeCents | dollar}}/{{formModel.priceChargeUnit}}</el-tag>
      </el-form-item>

      <span class="m-r-20 m-l-20">=</span>

      <el-form-item label="Sub Total" class="sub-total-right">
        <price-amount-input @change="updateValue" v-model="subTotalCents" :disabled="!formModel.priceEstimateByDefault">
        </price-amount-input>
      </el-form-item>
    </el-row>

    <el-row>
      <el-form-item label="Sub Total" class="sub-total-left">
        <el-tag type="gray">{{subTotalCents | dollar}}</el-tag>
      </el-form-item>

      <span class="m-l-20 m-r-20">+</span>

      <el-form-item label="Tax 1" class="tax">
        <el-tag>{{taxOneCents | dollar}}</el-tag>
      </el-form-item>

      <span class="m-l-20 m-r-20">+</span>

      <el-form-item label="Tax 2" class="tax">
        <el-tag>{{taxTwoCents | dollar}}</el-tag>
      </el-form-item>

      <span class="m-l-20 m-r-20">+</span>

      <el-form-item label="Tax 3" class="tax">
        <el-tag>{{taxThreeCents | dollar}}</el-tag>
      </el-form-item>

      <span class="m-l-20 m-r-20">=</span>

      <el-form-item label="Grand Total" class="grand-total">
        <el-tag type="primary">{{grandTotalCents | dollar}}</el-tag>
      </el-form-item>
    </el-row>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">Cancel</el-button>
    <el-button @click="save" type="primary">Save</el-button>
  </div>
</el-dialog>
</template>

<script>
import _ from 'lodash'
import errorI18nKey from '@/utils/error-i18n-key'
import { dollar } from '@/helpers/filters'
import PriceAmountInput from '@/components/price-amount-input'

export default {
  name: 'OrderLineItemDialog',
  props: ['value', 'errors', 'isVisible'],
  components: {
    PriceAmountInput
  },
  filters: {
    dollar
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      orderQuantity: this.value.orderQuantity,
      chargeQuantity: this.value.chargeQuantity,
      subTotalCents: this.value.subTotalCents,
      taxOneCents: this.value.taxOneCents,
      taxTwoCents: this.value.taxTwoCents,
      taxThreeCents: this.value.taxThreeCents,
      grandTotalCents: this.value.grandTotalCents,
      isEstimate: this.value.isEstimate
    }
  },
  computed: {
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('orderLineItem', k, v[0]), { name: _.startCase(k) })
        return result
      }, {})
    },
    isIsEstimateTogglable () {
      if (this.formModel.priceEstimateByDefault) {
        return true
      }

      return false
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
      this.orderQuantity = v.orderQuantity
      this.chargeQuantity = v.chargeQuantity
      this.subTotalCents = v.subTotalCents
      this.taxOneCents = v.taxOneCents
      this.taxTwoCents = v.taxTwoCents
      this.taxThreeCents = v.taxThreeCents
      this.grandTotalCents = v.grandTotalCents
      this.isEstimate = v.isEstimate
    },
    chargeQuantity (chargeQuantity) {
      if (chargeQuantity && this.formModel.priceEstimateByDefault) {
        this.subTotalCents = chargeQuantity * this.formModel.priceChargeCents
        this.refreshTaxAndGrandTotal()
      }
    },
    orderQuantity (orderQuantity) {
      if (this.formModel.priceEstimateByDefault) {
        this.chargeQuantity = orderQuantity * (this.formModel.priceEstimateAveragePercentage / 100)
        return
      }

      this.subTotalCents = orderQuantity * this.formModel.priceChargeCents
      this.refreshTaxAndGrandTotal()
    },
    subTotalCents (subTotalCents) {
      if (this.formModel.priceEstimateByDefault) {
        this.chargeQuantity = subTotalCents / this.formModel.priceChargeCents
      }
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    refreshTaxAndGrandTotal () {
      this.taxOneCents = this.subTotalCents * (this.formModel.priceTaxOnePercentage / 100)
      this.taxTwoCents = this.subTotalCents * (this.formModel.priceTaxTwoPercentage / 100)
      this.taxThreeCents = this.subTotalCents * (this.formModel.priceTaxThreePercentage / 100)
      this.grandTotalCents = this.subTotalCents + this.taxOneCents + this.taxTwoCents + this.taxThreeCents
    },
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.formModel.orderQuantity = this.orderQuantity
      this.formModel.chargeQuantity = this.chargeQuantity
      this.formModel.subTotalCents = this.subTotalCents
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
