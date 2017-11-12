<template>
<el-form :model="formModel" label-position="top" size="small">
  <el-row v-if="!formModel.id" class="m-b-20">
    <el-form-item label="Source Type" class="type">
      <el-radio-group @change="reset()" v-model="type">
        <el-radio-button label="Product"></el-radio-button>
        <el-radio-button label="None"></el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-row>

  <el-row class="m-b-20">
    <el-col v-if="!formModel.id && type === 'Product'" :span="9" class="p-r-10">
      <el-form-item label="Product" class="full">
        <remote-select
          :value="product"
          :records="selectableProducts"
          :is-loading="isLoadingSelectableProducts"
          @filter="loadSelectableProducts"
          @change="balanceByProduct($event)"
          no-data-text="No matching product"
          placeholder="Type to start searching..."
          class="product-select"
        >
        </remote-select>
      </el-form-item>
    </el-col>

    <el-col :span="9" class="p-l-10">
      <el-form-item v-if="canSelectVariant(formModel, type)" label="Variant" class="full">
        <el-select
          :value="formModel.product"
          @change="balanceByProductVariant($event)"
          value-key="id"
          placeholder="Select variant..."
          class="product-item-select"
        >
          <el-option
            v-for="item in selectableProductVariants"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
            {{item.name}}
          </el-option>
        </el-select>
      </el-form-item>
      <p v-else></p>
    </el-col>

    <el-col v-if="type === 'None' || formModel.id" :span="18">
      <el-form-item label="Name" class="name full">
        <el-input v-model="formModel.name" @input="updateValue()" :disabled="!!formModel.id"></el-input>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="Sub Total Amount is" class="is-estimate">
        <el-switch
          v-model="formModel.isEstimate"
          :disabled="!isIsEstimateTogglable"
          @change="updateValue()"
          active-text="Estimate"
          inactive-text="Exact">
        </el-switch>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row v-if="type === 'Product'" class="m-b-20">
    <el-form-item label="Order Qty." class="order-quantity">
      <el-input-number
        :value="formModel.orderQuantity"
        :min="1"
        :step="1"
        :disabled="!formModel.price"
        @change="balanceByOrderQuantity($event)"
        controls-position="right"
      >
      </el-input-number>
    </el-form-item>

    <span class="sign m-r-20 m-l-20">=</span>

    <el-form-item label="Charge Qty." class="charge-quantity">
      <el-input-number
        :value="formModel.chargeQuantity"
        :controls="false"
        :disabled="!formModel.priceEstimateByDefault"
        :min="0"
        @focus="$event.target.select()"
        @change="balanceByChargeQuantity($event)"
      >
      </el-input-number>
    </el-form-item>

    <span class="sign" v-if="formModel.priceChargeUnit">
      {{formModel.priceChargeUnit}}
    </span>

    <span class="sign m-r-20 m-l-20">x</span>

    <el-form-item label="Price" class="price">
      <el-tag v-if="formModel.id" :disable-transitions="true">
        {{formModel.priceChargeCents | dollar}}/{{formModel.priceChargeUnit}}
      </el-tag>

      <el-select v-else
        :value="formModel.price"
        :disabled="!formModel.price"
        @change="balanceByPrice($event)"
        value-key="id"
        placeholder=""
      >
        <el-option
          v-for="price in selectablePrices"
          :key="price.id"
          :label="price | chargeDollar"
          :value="price"
        >
          <span v-if="price.name">{{price.name}} -</span>
          <span>{{price | chargeDollar}}</span>
        </el-option>
      </el-select>
    </el-form-item>

    <span class="sign m-r-20 m-l-20">=</span>
    <el-form-item label="Sub Total Amt." class="sub-total-right">
      <money-input
        :value="formModel.subTotalCents"
        :disabled="!formModel.priceEstimateByDefault"
        @change="balanceBySubTotalCents($event)"
        >
      </money-input>
    </el-form-item>
  </el-row>

  <el-row>
    <el-form-item label="Sub Total Amt." class="sub-total-left">
      <money-input
        :value="formModel.subTotalCents"
        :disabled="type === 'Product'"
        @change="balanceBySubTotalCents($event)"
      >
      </money-input>
    </el-form-item>

    <span class="sign m-l-5 m-r-5">+</span>

    <el-form-item label="Tax 1" class="tax">
      <money-input
        v-model="formModel.taxOneCents"
        :disabled="type === 'Product'"
        @change="balanceByTax()"
      >
      </money-input>
    </el-form-item>

    <span class="sign m-l-5 m-r-5">+</span>

    <el-form-item label="Tax 2" class="tax">
      <money-input
        v-model="formModel.taxTwoCents"
        :disabled="type === 'Product'"
        @change="balanceByTax()"
      >
      </money-input>
    </el-form-item>

    <span class="sign m-l-5 m-r-5">+</span>

    <el-form-item label="Tax 3" class="tax">
      <money-input
        v-model="formModel.taxThreeCents"
        :disabled="type === 'Product'"
        @change="balanceByTax()"
      >
      </money-input>
    </el-form-item>

    <span class="sign m-l-5 m-r-5">=</span>

    <el-form-item label="Grand Total Amt." class="grand-total">
      <el-tag type="primary">{{formModel.grandTotalCents | dollar}}</el-tag>
    </el-form-item>
  </el-row>
</el-form>
</template>

<script>
import _ from 'lodash'
import errorI18nKey from '@/utils/error-i18n-key'
import { dollar, chargeDollar } from '@/helpers/filters'
import Price from '@/models/price'
import OrderLineItem from '@/models/order-line-item'
import RemoteSelect from '@/components/remote-select'

import MoneyInput from '@/components/money-input'

export default {
  name: 'OrderLineItemForm',
  props: ['value', 'errors', 'isVisible'],
  components: {
    RemoteSelect,
    MoneyInput
  },
  filters: {
    dollar,
    chargeDollar
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      type: 'Product',
      product: undefined
    }
  },
  computed: {
    isLoadingSelectableProducts () {
      return this.$store.state.orderLineItem.isLoadingSelectableProducts
    },
    selectableProducts () {
      return this.$store.state.orderLineItem.selectableProducts
    },
    selectableProductVariants () {
      return this.$store.state.orderLineItem.selectableProductVariants
    },
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
    },
    selectablePrices () {
      if (this.formModel.product) {
        let prices = this.formModel.product.prices

        let lowestActivePrice = Price.getLowestPrice(prices, this.formModel.orderQuantity, 'active')
        let internalPrices = _.filter(prices, (price) => {
          return price.status === 'internal' && price.minimumOrderQuantity <= this.formModel.price.minimumOrderQuantity
        })

        if (lowestActivePrice) {
          return _.concat(lowestActivePrice, internalPrices)
        }
        return internalPrices
      }

      return []
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (!newValue.product.id && oldValue.product.id) {
        this.product = undefined
        this.resetSelectableProducts()
      }

      this.formModel = _.cloneDeep(newValue)
      if (!this.formModel.id) {
        return
      }

      if (this.formModel.product) {
        this.type = 'Product'
      } else {
        this.type = 'None'
      }
    }
  },
  methods: {
    updateValue: _.debounce(function (formModel) {
      formModel = formModel || this.formModel
      this.$emit('input', formModel)
    }, 300),
    loadSelectableProducts: _.debounce(function (searchKeyword) {
      return this.$store.dispatch('orderLineItem/loadSelectableProducts', {
        search: searchKeyword,
        filter: { status: ['active', 'internal'] },
        include: 'prices,defaultPrice,variants.prices,variants.defaultPrice'
      })
    }, 300),
    canSelectVariant (formModel, type) {
      return !formModel.id && formModel.product.kind === 'variant' && type === 'Product'
    },
    resetSelectableProducts () {
      this.$store.dispatch('orderLineItem/resetSelectableProducts')
    },
    reset () {
      this.formModel = OrderLineItem.objectWithDefaults()
      this.$emit('input', this.formModel)
    },
    balanceByTax () {
      this.updateValue(OrderLineItem.balanceByTax(this.formModel))
    },
    balanceByChargeQuantity (chargeQuantity) {
      this.formModel.chargeQuantity = chargeQuantity
      this.updateValue(OrderLineItem.balanceByChargeQuantity(this.formModel))
    },
    balanceByOrderQuantity (orderQuantity) {
      this.formModel.orderQuantity = orderQuantity
      this.updateValue(OrderLineItem.balanceByOrderQuantity(this.formModel))
    },
    balanceBySubTotalCents (subTotalCents) {
      this.formModel.subTotalCents = subTotalCents
      this.updateValue(OrderLineItem.balanceBySubTotalCents(this.formModel))
    },
    balanceByPrice (price) {
      if (this.formModel.price.id === price.id) {
        return
      }

      this.formModel.price = price
      this.updateValue(OrderLineItem.balanceByPrice(this.formModel))
    },
    balanceByProductVariant (variant) {
      if (this.formModel.product.id === variant.id) {
        return
      }

      this.formModel.product = variant
      this.updateValue(OrderLineItem.balanceByProduct(this.formModel))
    },
    balanceByProduct (product) {
      if (!product) {
        return this.reset()
      }

      if (product.kind === 'withVariants') {
        this.$store.dispatch('orderLineItem/loadSelectableProductVariants', {
          filter: { parentId: product.id, status: ['active', 'internal'] },
          include: 'prices,defaultPrice'
        }).then(response => {
          let primaryVariant = _.find(response.resources, { primary: true })
          let formModel = _.cloneDeep(this.formModel)
          formModel.product = primaryVariant
          this.updateValue(OrderLineItem.balanceByProduct(formModel))
        })
      } else {
        this.product = product
        let formModel = _.cloneDeep(this.formModel)
        formModel.product = product
        this.updateValue(OrderLineItem.balanceByProduct(formModel))
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.sign {
  font-size: 13px;
}

.el-form-item {
  display: inline-block;
  margin: 0px;

  &.full {
    width: 100%;
  }
}

.el-form-item.type {
  margin-right: 20px;
}

.product-select {
  width: 100%;
}

.product-item-select {
  width: 100%;
}

.el-form-item.is-estimate {
  float: right;
}

.el-form-item.order-quantity .el-input-number {
  width: 100px;
}

.el-form-item.charge-quantity .el-input-number {
  width: 100px;
}

.el-form-item.tax .el-input {
  width: 90px;
  text-align: right;
}

.el-form-item.price .el-select {
  width: 150px;
}

.el-tag {
  font-size: 13px;
  text-align: right;
  width: 110px;
}

.el-form-item.sub-total-right, .el-form-item.grand-total {
  float: right;
}

.el-form-item.sub-total-right, .el-form-item.sub-total-left {
  .el-tag {
    width: 100px;
  }

  .el-input {
    width: 110px;
    text-align: right;
  }
}
</style>
