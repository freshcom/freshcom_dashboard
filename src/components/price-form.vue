<template>
<el-form :model="formModel" @input.native="updateValue" size="small" label-width="180px">
  <el-form-item label="Product">
    {{formModel.product.id}}
  </el-form-item>

  <hr>

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name">
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMsgs.label" required>
    <el-input v-model="formModel.label"></el-input>
  </el-form-item>

  <el-form-item v-if="isRootPrice(formModel)" label="Charge Amount" :error="chargeAmountError" required>
    <money-input v-model="formModel.chargeCents" @change="updateValue" class="charge-amount-input">
    </money-input>
    <span> / </span>
    <el-input v-model="formModel.chargeUnit" class="unit-input" placeholder="Unit"></el-input>
  </el-form-item>

  <el-form-item v-if="!isRootPrice(formModel)" label="Unit" :error="errorMsgs.chargeUnit" required>
    <el-input v-model="formModel.chargeUnit" class="unit-input" placeholder="Unit"></el-input>
  </el-form-item>

  <el-form-item v-if="isRootPrice(formModel)" label="Estimate By Default" :error="errorMsgs.estimateByDefault" required>
    <el-switch
      @change="updateValue"
      v-model="formModel.estimateByDefault"
      on-text="Yes"
      off-text="No">
    </el-switch>
  </el-form-item>

  <el-form-item v-if="formModel.estimateByDefault" label="Order Unit" :error="errorMsgs.orderUnit" required>
    <el-input v-model="formModel.orderUnit" class="unit-input"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.estimateByDefault" :error="errorMsgs.estimateAveragePercentage" label="Estimate Average" required>
    <percentage-input v-model="formModel.estimateAveragePercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item v-if="formModel.estimateByDefault" :error="errorMsgs.estimateMaximumPercentage" label="Estimate Maximum" required>
    <percentage-input v-model="formModel.estimateMaximumPercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Minimum Order Quantity" required>
    <el-input-number @change="updateValue" v-model="formModel.minimumOrderQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Tax One" required>
    <percentage-input v-model="formModel.taxOnePercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Tax Two" required>
    <percentage-input v-model="formModel.taxTwoPercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Tax Three" required>
    <percentage-input v-model="formModel.taxThreePercentage">
    </percentage-input>
  </el-form-item>

  <div class="children-form" v-if="!isRootPrice(formModel)">
    <div v-for="child in formModel.children" class="child-row">
      <hr>

      <div class="product-item">{{child.product.name}}</div>

      <div class="price">
        <money-input v-model="child.chargeCents" class="child-price-input">
        </money-input>
      </div>
    </div>

    <div class="total">
      <hr>

      <span>Product Price: </span> <span>${{subTotal}}</span><span v-if="formModel.chargeUnit">/{{formModel.chargeUnit}}</span><br>
    </div>
  </div>

</el-form>
</template>

<script>
import _ from 'lodash'
import MoneyInput from '@/components/money-input'
import PercentageInput from '@/components/percentage-input'
import translateErrors from '@/helpers/translate-errors'
import ProductItemSelect from '@/components/product-item-select'
import ProductItemAPI from '@/api/product-item'
import JSONAPI from '@/jsonapi'
import Price from '@/models/price'

export default {
  name: 'PriceForm',
  components: {
    MoneyInput,
    PercentageInput,
    ProductItemSelect
  },
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      children: [{ type: 'Price' }, { type: 'Price' }],
      productItems: []
    }
  },
  created () {
    if (this.session && this.formModel.product) {
      this.setPriceChildren()
    }
  },
  computed: {
    session () {
      return this.$store.state.session.record
    },
    errorMsgs () {
      return translateErrors(this.errors, 'price')
    },
    chargeAmountError () {
      if (this.errorMsgs.chargeCents) {
        return this.errorMsgs.chargeCents
      }

      if (this.errorMsgs.chargeUnit) {
        return this.errorMsgs.chargeUnit
      }
    },
    subTotalCents () {
      return _.reduce(this.formModel.children, (acc, price) => {
        let cc = price.chargeCents || 0
        return acc + cc
      }, 0)
    },
    subTotal () {
      return (this.subTotalCents / 100).toFixed(2)
    },
    grandTotalCents () {
      return _.reduce(this.formModel.children, (acc, price) => {
        let cc = price.chargeCents || 0
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
    value (v) {
      this.formModel = _.cloneDeep(v)
    },
    session (newSession) {
      if (!newSession) { return }

      if (this.formModel.product) {
        this.setPriceChildren()
      }
    },
    subTotalCents (subTotalCents) {
      this.formModel.chargeCents = subTotalCents
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    isRootPrice (formModel) {
      if (formModel.product.kind === 'simple' || formModel.product.kind === 'variant') {
        return true
      }

      return false
    },
    setPriceChildren () {
      if (this.formModel.id) { return }
      ProductItemAPI.queryRecord({ filter: { productId: this.formModel.product.id } }).then(response => {
        let apiPayload = response.data
        let productItems = JSONAPI.deserialize(apiPayload.data)

        this.formModel.children = _.map(productItems, pi => {
          let price = Price.objectWithDefaults()
          price.productItem = pi
          price.chargeCents = 0
          return price
        })

        this.formModel.chargeCents = 0
        this.updateValue()
      })
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
  width: 150px;
}
</style>
