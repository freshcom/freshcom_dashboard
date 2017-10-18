<template>
<el-form :model="formModel" label-position="top">
  <el-row v-if="!formModel.id">
    <el-form-item label="Type">
      <el-radio-group @change="typeChanged" v-model="type">
        <el-radio-button label="Product"></el-radio-button>
        <el-radio-button label="Custom"></el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item class="is-estimate">
      <b>Is Estimate?</b>
      <el-switch
        v-model="formModel.isEstimate"
        :disabled="!isIsEstimateTogglable"
        on-text="Yes"
        off-text="No">
      </el-switch>
    </el-form-item>
  </el-row>

  <el-row v-if="formModel.id">
    <p><b>Name: </b> {{formModel.name}}</p>
  </el-row>
  <el-row v-if="!formModel.id && type === 'Product'" class="m-b-10">
    <el-col :span="12" class="p-r-10">
      <el-form-item label="Product" class="full">
        <remote-select
          v-model="formModel.product"
          @filter="loadSelectableProducts"
          @reset="resetSelectableProducts"
          @input="productChanged"
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
        <el-select @select="productItemChanged" :disabled="!isProductItemSelectable" :placeholder="productItemSelectPlaceholder" v-model="formModel.productItem" value-key="id" class="product-item-select">
          <el-option v-for="item in selectableProductItems" :key="item.id" :label="item.name" :value="item">
            {{item.name}}
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row v-if="!formModel.id && type === 'Custom'" class="m-b-10">
    <el-form-item label="Name" class="name full">
      <el-input v-model="formModel.name" @change="updateValue"></el-input>
    </el-form-item>
  </el-row>

  <el-row v-if="type === 'Product'">
    <el-form-item label="Order Quantity" class="order-quantity">
      <el-input-number v-model="formModel.orderQuantity" @change="orderQuantityChanged" :min="1" :step="1" :disabled="!formModel.price"></el-input-number>
    </el-form-item>

    <span v-if="formModel.priceOrderUnit">{{formModel.priceOrderUnit}}</span>

    <span v-if="formModel.priceEstimateByDefault" class="m-r-20 m-l-20">=</span>

    <el-form-item v-if="formModel.priceEstimateByDefault" label="Charge Quantity" class="charge-quantity">
      <el-input v-model="formModel.chargeQuantity" @change="chargeQuantityChanged" @focus="$event.target.select()" type="number"></el-input>
    </el-form-item>

    <span v-if="formModel.priceEstimateByDefault && formModel.priceChargeUnit">{{formModel.priceChargeUnit}}</span>

    <span class="m-r-20 m-l-20">x</span>

    <el-form-item label="Price" class="price">
      <el-tag v-if="formModel.id" :close-transition="true">{{formModel.priceChargeCents | dollar}}/{{formModel.priceChargeUnit}}</el-tag>
      <el-select v-else @select="priceChanged" v-model="formModel.price" value-key="id" placeholder="" :disabled="!formModel.price">
        <el-option v-for="price in selectablePrices" :key="price.id" v-bind:label="price | chargeDollar" :value="formModel.price">
          <span v-if="price.name">{{price.name}} -</span>
          <span>{{price | chargeDollar}}</span>
        </el-option>
      </el-select>
    </el-form-item>

    <span class="m-r-20 m-l-20">=</span>

    <el-form-item label="Sub Total" class="sub-total-right">
      <price-amount-input @input="subTotalCentsChanged" v-model="formModel.subTotalCents" :disabled="!formModel.priceEstimateByDefault">
      </price-amount-input>
    </el-form-item>
  </el-row>

  <el-row>
    <el-form-item label="Sub Total" class="sub-total-left">
      <el-tag type="gray" v-if="type === 'Product'" :close-transition="true">{{formModel.subTotalCents | dollar}}</el-tag>
      <price-amount-input v-else @input="subTotalCentsChanged" v-model="formModel.subTotalCents"></price-amount-input>
    </el-form-item>

    <span class="m-l-10 m-r-10">+</span>

    <el-form-item label="Tax 1" class="tax">
      <el-tag v-if="type === 'Product'" :close-transition="true">{{formModel.taxOneCents | dollar}}</el-tag>
      <price-amount-input v-else @input="taxCentsChanged" v-model="formModel.taxOneCents"></price-amount-input>
    </el-form-item>

    <span class="m-l-10 m-r-10">+</span>

    <el-form-item label="Tax 2" class="tax">
      <el-tag v-if="type === 'Product'" :close-transition="true">{{formModel.taxTwoCents | dollar}}</el-tag>
      <price-amount-input v-else @input="taxCentsChanged" v-model="formModel.taxTwoCents"></price-amount-input>
    </el-form-item>

    <span class="m-l-10 m-r-10">+</span>

    <el-form-item label="Tax 3" class="tax">
      <el-tag v-if="type === 'Product'" :close-transition="true">{{formModel.taxThreeCents | dollar}}</el-tag>
      <price-amount-input v-else @input="taxCentsChanged" v-model="formModel.taxThreeCents"></price-amount-input>
    </el-form-item>

    <span class="m-l-10 m-r-10">=</span>

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

export default {
  name: 'OrderLineItemForm',
  props: ['value', 'errors', 'isVisible'],
  components: {
    RemoteSelect,
    PriceAmountInput
  },
  filters: {
    dollar,
    chargeDollar
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      type: 'Product'
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
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    loadSelectableProducts: _.debounce(function (searchKeyword) {
      this.$store.dispatch('orderLineItem/loadSelectableProducts', { search: searchKeyword, filter: { status: ['active', 'internal'] }, include: 'prices,defaultPrice' })
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
        this.formModel.taxOneCents = this.formModel.subTotalCents * (this.formModel.priceTaxOnePercentage / 100)
        this.formModel.taxTwoCents = this.formModel.subTotalCents * (this.formModel.priceTaxTwoPercentage / 100)
        this.formModel.taxThreeCents = this.formModel.subTotalCents * (this.formModel.priceTaxThreePercentage / 100)
      }
      this.formModel.grandTotalCents = this.formModel.subTotalCents + this.formModel.taxOneCents + this.formModel.taxTwoCents + this.formModel.taxThreeCents
    },
    typeChanged (type) {
      this.reset()
    },
    taxCentsChanged (taxCents) {
      this.refreshTaxAndGrandTotal()
    },
    chargeQuantityChanged (chargeQuantity) {
      console.log('chargeQuantityChanged')
      this.formModel.subTotalCents = this.formModel.chargeQuantity * this.formModel.priceChargeCents

      this.refreshTaxAndGrandTotal()
      this.updateValue()
    },
    orderQuantityChanged (orderQuantity) {
      console.log('orderQuantityChanged')
      if (this.formModel.priceEstimateByDefault) {
        this.formModel.chargeQuantity = orderQuantity * (this.formModel.priceEstimateAveragePercentage / 100)
      } else {
        this.formModel.chargeQuantity = orderQuantity
      }

      this.chargeQuantityChanged(this.formModel.chargeQuantity)
    },
    subTotalCentsChanged (subTotalCents) {
      console.log('subTotalCentsChanged')
      if (this.formModel.isEstimate) {
        this.formModel.chargeQuantity = subTotalCents / this.formModel.priceChargeCents
      }

      this.refreshTaxAndGrandTotal()
      this.updateValue()
    },
    priceChanged (price) {
      console.log('priceChanged')
      if (!price) { return }

      this.formModel.priceEstimateAveragePercentage = price.estimateAveragePercentage
      this.formModel.priceEstimateByDefault = price.estimateByDefault
      this.formModel.priceChargeCents = price.chargeCents
      this.formModel.priceTaxOnePercentage = price.taxOnePercentage
      this.formModel.priceTaxTwoPercentage = price.taxTwoPercentage
      this.formModel.priceTaxThreePercentage = price.taxThreePercentage
      this.formModel.priceChargeUnit = price.chargeUnit
      this.formModel.priceOrderUnit = price.orderUnit

      if (this.formModel.priceEstimateByDefault) {
        this.formModel.chargeQuantity = this.formModel.orderQuantity * (this.formModel.priceEstimateAveragePercentage / 100)
        this.formModel.isEstimate = true
      } else {
        this.formModel.chargeQuantity = this.formModel.orderQuantity
        this.formModel.isEstimate = false
      }

      this.chargeQuantityChanged(this.formModel.chargeQuantity)
    },
    productItemChanged (productItem) {
      console.log('productItemChanged')
      if (productItem) {
        this.formModel.price = productItem.defaultPrice
        this.priceChanged(this.formModel.price)
      }
    },
    productChanged (product) {
      if (!product) {
        return this.reset()
      }

      if (product.itemMode === 'all') {
        this.formModel.price = product.defaultPrice
        this.priceChanged(this.formModel.price)
      } else {
        this.$store.dispatch('orderLineItem/loadSelectableProductItems', { filter: { productId: product.id, status: ['active', 'internal'] }, include: 'prices,defaultPrice' }).then(response => {
          let primaryItem = _.find(response.resources, { primary: true })
          this.formModel.productItem = primaryItem
          this.productItemChanged(this.formModel.productItem)
        })
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
  margin: 10px 0px;

  &.full {
    width: 100%;
  }
}

.el-form-item.is-estimate {
  margin-left: 20px;
}

.product-select {
  width: 100%;
}

.product-item-select {
  width: 100%;
}

.el-form-item.order-quantity .el-input-number {
  width: 120px;
}

.el-form-item.charge-quantity .el-input {
  width: 100px;
}

.el-form-item.tax .el-input {
  width: 110px;
}

.el-form-item.price .el-select {
  width: 150px;
}

.el-form-item.price .el-tag, .el-form-item.tax .el-tag, .el-form-item.sub-total-left .el-tag, .el-form-item.grand-total .el-tag {
  font-size: 18px;
  padding: 6px 15px;
  height: 36px;
  width: 110px;
}

.el-form-item.sub-total-right, .el-form-item.grand-total {
  float: right;
}

.el-form-item.sub-total-right .el-input, .el-form-item.sub-total-left .el-input {
  width: 100px;
}
</style>