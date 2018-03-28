<template>
<div class="component-wrapper price-fieldset">
  <el-form-item label="Product" :error="errorMsgs.customer">
    <product-select v-model="formModel.product" :disabled="!!formModel.id" @input="updateValue()"></product-select>
  </el-form-item>

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select v-model="formModel.status" @change="updateValue">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMsgs.label">
    <el-input v-model="formModel.label" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Charge Amount" :error="chargeAmountError" required>
    <money-input v-model="formModel.chargeAmountCents" @change="updateValue()" class="charge-amount-input"></money-input>
    <span>/</span>
    <el-input v-model="formModel.chargeUnit" @input="updateValue()" class="unit-input" placeholder="Unit"></el-input>
  </el-form-item>

  <el-form-item label="Estimate By Default" :error="errorMsgs.estimateByDefault" required>
    <el-switch
      v-model="formModel.estimateByDefault"
      @change="updateValue()"
      active-text="Yes"
      inactive-text="No">
    </el-switch>
  </el-form-item>

  <el-form-item v-if="formModel.estimateByDefault" label="Order Unit" :error="errorMsgs.orderUnit" required>
    <el-input v-model="formModel.orderUnit" @input="updateValue()" class="unit-input"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.estimateByDefault" :error="errorMsgs.estimateAveragePercentage" label="Estimate Average" required>
    <percentage-input v-model="formModel.estimateAveragePercentage" @input="updateValue()">
    </percentage-input>
  </el-form-item>

  <el-form-item v-if="formModel.estimateByDefault" :error="errorMsgs.estimateMaximumPercentage" label="Estimate Maximum" required>
    <percentage-input v-model="formModel.estimateMaximumPercentage" @input="updateValue()">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Minimum Order Quantity" required>
    <el-input-number v-model="formModel.minimumOrderQuantity" :min="1" :step="1" @change="updateValue()"></el-input-number>
  </el-form-item>

  <el-form-item label="Tax One" required>
    <percentage-input v-model="formModel.taxOnePercentage" @input="updateValue()">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Tax Two" required>
    <percentage-input v-model="formModel.taxTwoPercentage" @input="updateValue()">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Tax Three" required>
    <percentage-input v-model="formModel.taxThreePercentage" @input="updateValue()">
    </percentage-input>
  </el-form-item>
</div>
</template>

<script>
import _ from 'lodash'

import ProductSelect from '@/components/product-select'
import MoneyInput from '@/components/money-input'
import PercentageInput from '@/components/percentage-input'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'price' })

export default {
  name: 'PriceFieldset',
  mixins: [FieldsetMixin],
  components: {
    ProductSelect,
    MoneyInput,
    PercentageInput
  },
  data () {
    return {
      children: [{ type: 'Price' }, { type: 'Price' }],
      productItems: []
    }
  },
  computed: {
    chargeAmountError () {
      if (this.errorMsgs.chargeAmountCents) {
        return this.errorMsgs.chargeAmountCents
      }

      if (this.errorMsgs.chargeUnit) {
        return this.errorMsgs.chargeUnit
      }
    },
    subTotalCents () {
      return _.reduce(this.formModel.children, (acc, price) => {
        let cc = price.chargeAmountCents || 0
        return acc + cc
      }, 0)
    },
    subTotal () {
      return (this.subTotalCents / 100).toFixed(2)
    },
    grandTotalCents () {
      return _.reduce(this.formModel.children, (acc, price) => {
        let cc = price.chargeAmountCents || 0
        let t1p = price.taxOnePercentage / 100
        let t2p = price.taxTwoPercentage / 100
        let t3p = price.taxThreePercentage / 100

        return acc + cc + cc * t1p + cc * t2p + cc * t3p
      }, 0)
    },
    grandTotal () {
      return (this.grandTotalCents / 100).toFixed(2)
    }
  },
  watch: {
    subTotalCents (subTotalCents) {
      this.formModel.chargeAmountCents = subTotalCents
    }
  },
  methods: {
    isRootPrice (formModel) {
      if (formModel.product && (formModel.product.kind === 'simple' || formModel.product.kind === 'variant')) {
        return true
      }

      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.unit-input {
  width: 100px;
}

.ratio-input {
  width: 100px;
}

.child-row {
  vertical-align: middle;
  margin-top: 10px;

  .product-item {
    width: 40%;
    height: 36px;
    line-height:36px;
    display: inline-block;
  }

  .price {
    width: 60%;
    float: right;
    text-align: right;
  }

  hr {
    margin-bottom: 10px;
  }

  &:last-child {
    margin-bottom: 10px;
  }

  .child-price-input {
    width: 100px;
  }

  .child-tax-input {
    width: 80px;
  }
}

.total {
  text-align: right;
  margin-top: 10px;
  margin-bottom: 10px;

  hr {
    margin-bottom: 10px;
  }
}

.children-form {
  margin-right: 30px;
  margin-left: 30px;
}

.charge-amount-input {
  width: 120px;
  text-align: right;
}
</style>
