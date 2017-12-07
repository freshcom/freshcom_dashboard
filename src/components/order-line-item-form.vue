<template>
<el-form :model="formModel" label-position="top" size="small">
  <el-row v-if="canSelectType" class="m-b-20">
    <el-form-item label="Type" class="type">
      <el-radio-group @change="reset()" v-model="type">
        <el-radio-button label="Product"></el-radio-button>
        <el-radio-button label="Custom"></el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-row>

  <el-row class="m-b-20">
    <el-col v-if="canSelectProduct" :span="9" class="p-r-10">
      <el-form-item label="Product" class="full">
        <remote-select
          :search-method="searchProducts"
          :value="selectedProduct"
          @change="handleProductChange($event)"
          no-data-text="No matching product"
          placeholder="Type to start searching..."
          class="product-select"
        >
        </remote-select>
      </el-form-item>
    </el-col>

    <el-col :span="9" class="p-l-10">
      <el-form-item v-if="canSelectVariant" label="Variant" class="full">
        <el-select
          :value="formModel.product"
          @change="handleProductVariantChange($event)"
          value-key="id"
          placeholder="Select variant..."
          class="product-item-select"
        >
          <el-option
            v-for="item in productVariants"
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

    <el-col v-if="canViewName" :span="18">
      <el-form-item label="Name" class="name full">
        <el-input v-model="formModel.name" @input="updateValue()" :disabled="!!formModel.id"></el-input>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="Sub Total Amount is" class="is-estimate">
        <el-switch
          v-model="formModel.isEstimate"
          :disabled="!canToggleEstimate"
          @change="updateValue()"
          active-text="Estimate"
          inactive-text="Exact">
        </el-switch>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row v-if="canEnterOrderQuantity" class="m-b-20">
    <el-form-item label="Order Qty." class="order-quantity">
      <el-input-number
        :value="formModel.orderQuantity"
        :min="1"
        :step="1"
        :disabled="!formModel.price"
        @change="handleOrderQuantityChange($event)"
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
        @change="handleChargeQuantityChange($event)"
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
        @change="handlePriceChange($event)"
        value-key="id"
        placeholder=""
      >
        <el-option
          v-for="price in prices"
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
        @change="handleTaxChange()"
      >
      </money-input>
    </el-form-item>

    <span class="sign m-l-5 m-r-5">+</span>

    <el-form-item label="Tax 2" class="tax">
      <money-input
        v-model="formModel.taxTwoCents"
        :disabled="type === 'Product'"
        @change="handleTaxChange()"
      >
      </money-input>
    </el-form-item>

    <span class="sign m-l-5 m-r-5">+</span>

    <el-form-item label="Tax 3" class="tax">
      <money-input
        v-model="formModel.taxThreeCents"
        :disabled="type === 'Product'"
        @change="handleTaxChange()"
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
import freshcom from '@/freshcom-sdk'

import translateErrors from '@/helpers/translate-errors'
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
      type: 'Product',

      products: [],
      selectedProduct: null,
      isLoadingProducts: false,

      productVariants: [],

      formModel: _.cloneDeep(this.value)
    }
  },
  created () {
    if (!this.formModel.id) { return }

    if (this.formModel.product) {
      this.type = 'Product'
    } else {
      this.type = 'Custom'
    }
  },
  computed: {
    canViewName () {
      return this.type === 'Custom' || this.formModel.id
    },

    canEnterOrderQuantity () {
      return this.type === 'Product'
    },

    canSelectType () {
      return !this.formModel.id
    },

    canSelectVariant () {
      return !this.formModel.id &&
             this.formModel.product &&
             this.formModel.product.kind === 'variant' &&
             this.type === 'Product'
    },

    canSelectProduct () {
      return !this.formModel.id && this.type === 'Product'
    },

    canToggleEstimate () {
      return this.formModel.priceEstimateByDefault
    },

    errorMsgs () {
      return translateErrors(this.errors, 'orderLineItem')
    },

    prices () {
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
      if (!newValue.product && oldValue.product) {
        this.selectedProduct = {}
        this.products = []
        this.productVariants = []
      }

      this.formModel = _.cloneDeep(newValue)
      if (!this.formModel.id) {
        return
      }

      if (this.formModel.product) {
        this.type = 'Product'
      } else {
        this.type = 'Custom'
      }
    }
  },
  methods: {
    updateValue: _.debounce(function (formModel) {
      formModel = formModel || this.formModel
      this.$emit('input', formModel)
    }, 300),

    searchProducts (keyword) {
      return freshcom.listProduct({
        search: keyword,
        filter: { status: ['active', 'internal'] },
        include: 'prices,defaultPrice'
      }).then(response => {
        return response.data
      })
    },

    reset () {
      this.formModel = OrderLineItem.objectWithDefaults()
      this.products = []
      this.productVariants = []
      this.$emit('input', this.formModel)
    },

    handleTaxChange () {
      this.updateValue(OrderLineItem.balanceByTax(this.formModel))
    },

    handleChargeQuantityChange (chargeQuantity) {
      this.formModel.chargeQuantity = chargeQuantity
      this.updateValue(OrderLineItem.balanceByChargeQuantity(this.formModel))
    },

    handleOrderQuantityChange (orderQuantity) {
      this.formModel.orderQuantity = orderQuantity
      this.updateValue(OrderLineItem.balanceByOrderQuantity(this.formModel))
    },

    balanceBySubTotalCents (subTotalCents) {
      this.formModel.subTotalCents = subTotalCents
      this.updateValue(OrderLineItem.balanceBySubTotalCents(this.formModel))
    },

    handlePriceChange (price) {
      if (this.formModel.price.id === price.id) {
        return
      }

      this.formModel.price = price
      this.updateValue(OrderLineItem.balanceByPrice(this.formModel))
    },

    handleProductVariantChange (variant) {
      if (this.formModel.product.id === variant.id) {
        return
      }

      this.formModel.product = variant
      this.updateValue(OrderLineItem.balanceByProduct(this.formModel))
    },

    handleProductChange (product) {
      if (!product) {
        return this.reset()
      }

      if (product.kind === 'withVariants') {
        freshcom.listProduct({
          filter: { parentId: product.id, status: ['active', 'internal'] },
          include: 'prices,defaultPrice'
        }).then(response => {
          let variants = response.data
          this.productVariants = variants
          this.formModel.product = _.find(variants, { primary: true })

          this.updateValue(OrderLineItem.balanceByProduct(this.formModel))
        })
      } else {
        this.selectedProduct = product
        this.formModel.product = product
        this.updateValue(OrderLineItem.balanceByProduct(this.formModel))
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
