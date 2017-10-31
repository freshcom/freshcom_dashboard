<template>
<el-form :model="formModel" label-position="top" size="small">
  <el-row class="m-b-20">
    <el-form-item v-if="!formModel.id" label="Source Type" class="type">
      <el-radio-group @change="typeChanged" v-model="type">
        <el-radio-button label="Product"></el-radio-button>
        <el-radio-button label="None"></el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="Sub Total is" class="is-estimate">
      <el-switch
        v-model="formModel.isEstimate"
        @change="updateValue()"
        :disabled="!isIsEstimateTogglable"
        active-text="Estimate"
        inactive-text="Exact">
      </el-switch>
    </el-form-item>
  </el-row>

  <el-row v-if="formModel.id" class="m-b-20">
    <p><b>Name: </b> {{formModel.name}}</p>
  </el-row>
  <el-row v-if="!formModel.id && type === 'Product'" class="m-b-20">
    <el-col :span="12" class="p-r-10">
      <el-form-item label="Product" class="full">
        <remote-select
          v-model="formModel.product"
          @filter="loadSelectableProducts"
          @clear="resetSelectableProducts"
          @input="balanceByProduct"
          :records="selectableProducts"
          :isLoading="isLoadingSelectableProducts"
          placeholder="Search for product..."
          class="product-select"
        >
        </remote-select>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="p-l-10">
      <el-form-item label="Product Item" class="full">
        <el-select @change="balanceByProductItem" :disabled="!isProductItemSelectable" :placeholder="productItemSelectPlaceholder" v-model="formModel.productItem" value-key="id" class="product-item-select">
          <el-option v-for="item in selectableProductItems" :key="item.id" :label="item.name" :value="item">
            {{item.name}}
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row v-if="!formModel.id && type === 'None'" class="m-b-20">
    <el-form-item label="Name" class="name full">
      <el-input v-model="formModel.name" @change="updateValue()"></el-input>
    </el-form-item>
  </el-row>

  <el-row v-if="type === 'Product'" class="m-b-20">
    <el-form-item label="Order Qty" class="order-quantity">
      <el-input-number
        v-model="formModel.orderQuantity"
        @input="balanceByOrderQuantity"
        :min="1"
        :step="1"
        :disabled="!formModel.price"
        controls-position="right"
      >
      </el-input-number>
    </el-form-item>

    <span class="m-r-20 m-l-20">=</span>

    <el-form-item label="Charge Qty" class="charge-quantity">
      <el-input-number
        v-model="formModel.chargeQuantity"
        @input="balanceByChargeQuantity"
        @focus="$event.target.select()"
        :controls="false"
        :disabled="!formModel.priceEstimateByDefault"
        :min="0"
      >
      </el-input-number>
    </el-form-item>

    <span v-if="formModel.priceChargeUnit">{{formModel.priceChargeUnit}}</span>

    <span class="m-r-20 m-l-20">x</span>

    <el-form-item label="Price" class="price">
      <el-tag v-if="formModel.id" :disable-transitions="true">{{formModel.priceChargeCents | dollar}}/{{formModel.priceChargeUnit}}</el-tag>
      <el-select v-else @change="balanceByPrice" v-model="formModel.price" value-key="id" placeholder="" :disabled="!formModel.price">
        <el-option v-for="price in selectablePrices" :key="price.id" v-bind:label="price | chargeDollar" :value="price">
          <span v-if="price.name">{{price.name}} -</span>
          <span>{{price | chargeDollar}}</span>
        </el-option>
      </el-select>
    </el-form-item>

    <span class="m-r-20 m-l-20">=</span>
    <el-form-item label="Sub Total" class="sub-total-right">
      <money-input
        v-model="formModel.subTotalCents"
        @input="balanceBySubTotalCents()"
        :disabled="!formModel.priceEstimateByDefault"
        >
      </money-input>
    </el-form-item>
  </el-row>

  <el-row class="m-b-20">
    <el-form-item label="Sub Total" class="sub-total-left">
      <money-input
      v-model="formModel.subTotalCents"
      @input="balanceBySubTotalCents()"
      :disabled="type === 'Product'"
      >
      </money-input>
    </el-form-item>

    <span class="m-l-5 m-r-5">+</span>

    <el-form-item label="Tax 1" class="tax">
      <money-input
        v-model="formModel.taxOneCents"
        @input="taxCentsChanged"
        :disabled="type === 'Product'"
      >
      </money-input>
    </el-form-item>

    <span class="m-l-5 m-r-5">+</span>

    <el-form-item label="Tax 2" class="tax">
      <money-input
        v-model="formModel.taxTwoCents"
        @input="taxCentsChanged"
        :disabled="type === 'Product'"
      >
      </money-input>
    </el-form-item>

    <span class="m-l-5 m-r-5">+</span>

    <el-form-item label="Tax 3" class="tax">
      <money-input
        v-model="formModel.taxThreeCents"
        @input="taxCentsChanged"
        :disabled="type === 'Product'"
      >
      </money-input>
    </el-form-item>

    <span class="m-l-5 m-r-5">=</span>

    <el-form-item label="Grand Total" class="grand-total">
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
import PriceAmountInput from '@/components/price-amount-input'
import RemoteSelect from '@/components/remote-select'
import MoneyInput from '@/components/money-input'

export default {
  name: 'OrderLineItemForm',
  props: ['value', 'errors', 'isVisible'],
  components: {
    RemoteSelect,
    PriceAmountInput,
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
      test: false
    }
  },
  computed: {
    isLoadingSelectableProducts () {
      return this.$store.state.orderLineItem.isLoadingSelectableProducts
    },
    selectableProducts () {
      return this.$store.state.orderLineItem.selectableProducts
    },
    selectableProductItems () {
      return this.$store.state.orderLineItem.selectableProductItems
    },
    isProductItemSelectable () {
      if (!this.formModel.product || this.formModel.product.itemMode === 'all') {
        return false
      }

      return true
    },
    productItemSelectPlaceholder () {
      if (this.formModel.product && this.formModel.product.itemMode === 'all') {
        return 'All'
      } else {
        return 'Select product first...'
      }
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
      if (this.formModel.productItem || (this.formModel.product && this.formModel.product.itemMode === 'all')) {
        let prices
        if (this.formModel.productItem) {
          prices = this.formModel.productItem.prices
        } else {
          prices = this.formModel.product.prices
        }

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
    value (v) {
      this.formModel = _.cloneDeep(v)
    }
  },
  methods: {
    updateValue: _.debounce(function (formModel) {
      formModel = formModel || this.formModel
      this.$emit('input', formModel)
    }, 300),
    loadSelectableProducts: _.debounce(function (searchKeyword) {
      if (searchKeyword) {
        this.$store.dispatch('orderLineItem/loadSelectableProducts', { search: searchKeyword, filter: { status: ['active', 'internal'] }, include: 'prices,defaultPrice' })
      }
    }, 300),
    resetSelectableProducts () {
      this.$store.dispatch('orderLineItem/resetSelectableProducts')
    },
    reset () {
      this.formModel = OrderLineItem.objectWithDefaults()
      this.$emit('input', this.formModel)
    },
    refreshTaxAndGrandTotal () {
      if (this.type === 'Product') {
        this.formModel.taxOneCents = Math.round(this.formModel.subTotalCents * (this.formModel.priceTaxOnePercentage / 100))
        this.formModel.taxTwoCents = Math.round(this.formModel.subTotalCents * (this.formModel.priceTaxTwoPercentage / 100))
        this.formModel.taxThreeCents = Math.round(this.formModel.subTotalCents * (this.formModel.priceTaxThreePercentage / 100))
      }
      this.formModel.grandTotalCents = this.formModel.subTotalCents + this.formModel.taxOneCents + this.formModel.taxTwoCents + this.formModel.taxThreeCents
    },
    typeChanged (type) {
      this.reset()
    },
    taxCentsChanged (taxCents) {
      this.refreshTaxAndGrandTotal()
    },
    balanceByChargeQuantity (chargeQuantity) {
      this.updateValue(OrderLineItem.balanceByChargeQuantity(this.formModel))
    },
    balanceByOrderQuantity (orderQuantity) {
      this.updateValue(OrderLineItem.balanceByOrderQuantity(this.formModel))
    },
    balanceBySubTotalCents (subTotalCents) {
      this.updateValue(OrderLineItem.balanceBySubTotalCents(this.formModel))
    },
    balanceByPrice (price) {
      this.updateValue(OrderLineItem.balanceByPrice(this.formModel))
    },
    balanceByProductItem (productItem) {
      this.updateValue(OrderLineItem.balanceByProductItem(this.formModel))
    },
    balanceByProduct (product) {
      if (!product) {
        return this.reset()
      }

      if (product.itemMode === 'all') {
        this.updateValue(OrderLineItem.balanceByProduct(this.formModel))
      } else {
        this.$store.dispatch('orderLineItem/loadSelectableProductItems', {
          filter: { productId: product.id, status: ['active', 'internal'] },
          include: 'prices,defaultPrice'
        }).then(response => {
          let primaryItem = _.find(response.resources, { primary: true })
          let formModel = _.cloneDeep(this.formModel)
          formModel.productItem = primaryItem
          this.updateValue(OrderLineItem.balanceByProductItem(formModel))
        })
      }
    }
  }
}
</script>


<style lang="scss" scoped>
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
