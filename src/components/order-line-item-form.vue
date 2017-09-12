<template>
<el-form @input.native="updateValue">
  <el-form-item>
    <div class="m-b-10">
      <product-select @select="setProduct" :filter="{ status: ['active', 'internal'] }" class="product-input">
      </product-select>

      <el-select @change="updateValue" :disabled="!isProductItemSelectable" placeholder="Select product first..." v-model="productItem" class="product-item-input">
        <template v-if="product">
          <el-option v-for="item in product.items" :key="item.id" :label="item.name" :value="item.id">
            {{item.name}}
          </el-option>
        </template>
      </el-select>
    </div>

    <div class="m-b-10">
      <span class="m-r-10">x</span>
      <el-input-number v-model="orderQuantity" :min="1" :step="1" class="order-quantity-input"></el-input-number>

      <span class="m-r-10">BOX</span>

      <span v-if="price && price.estimateByDefault">
        <span class="m-r-10">=</span>
        <el-input v-model="chargeQuantity" @focus="$event.target.select()" type="number" class="charge-quantity-input">
        </el-input>

        <span class="m-r-10">LB</span>

        <span class="m-r-10">x</span>
      </span>

      <span v-if="!price || !price.estimateByDefault" class="m-r-10">@</span>
      <el-select @change="updateValue" v-model="price" class="price-input">
        <template v-if="productItem">
          <el-option v-for="price in productItem.prices" :key="price.id" :label="chargePriceStr(price)" :value="price.id">
            {{chargePriceStr(price)}}
          </el-option>
        </template>
      </el-select>

      <div class="pull-right">
        <span class="m-r-10">=</span>

        <price-amount-input @change="updateValue" v-model="subTotalCents" :disabled="!price || !price.estimateByDefault">
        </price-amount-input>
      </div>
    </div>

    <div>

      <span class="pull-right">
        <span>Is Estimate?</span>
        <el-switch
          @change="updateValue"
          v-model="isEstimate"
          :disabled="true"
          on-text="Yes"
          off-text="No">
        </el-switch>

        <el-button type="default" :disabled="true">
          Add
        </el-button>
      </span>
    </div>
  </el-form-item>

</el-form>
</template>

<script>
import _ from 'lodash'
import JSONAPI from '@/jsonapi'
import ProductItemAPI from '@/api/product-item'

import OrderLineItem from '@/models/order-line-item'
import ProductItemSelect from '@/components/product-item-select'
import ProductSelect from '@/components/product-select'
import PriceAmountInput from '@/components/price-amount-input'

export default {
  name: 'OrderLineItemForm',
  props: ['value', 'errors', 'record'],
  components: {
    ProductItemSelect,
    ProductSelect,
    PriceAmountInput
  },
  data () {
    return {
      formModel: OrderLineItem.objectWithDefaults(),
      product: null,
      productItems: [],
      productItem: null,
      prices: [],
      price: null,
      isEstimate: false,
      orderQuantity: 1,
      chargeQuantity: null,
      subTotalCents: 1999
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    },
    productItem (productItem) {
      if (productItem) {
        this.price = productItem.defaultPrice
      }
    },
    price (price) {
      if (price.estimateByDefault) {
        this.chargeQuantity = this.orderQuantity * (price.estimateAveragePercentage / 100)
        this.isEstimate = true
      }
    },
    orderQuantity (orderQuantity) {
      if (this.price && !this.price.estimateByDefault) {
        this.subTotalCents = orderQuantity * this.price.chargeCents
      }
    }
  },
  computed: {
    isProductItemSelectable () {
      if (!this.product || this.product.itemModel === 'all') {
        return false
      }

      return true
    },
    productItemPlaceholder () {
      if (this.isProductItemSelectable) {
        return 'Select product first...'
      } else {
        return 'All'
      }
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    chargePriceStr (price) {
      return `$${price.chargeCents / 100} / ${price.chargeUnit}`
    },
    setProduct (product) {
      if (!product) {
        this.product = null
        this.productItem = null
        return
      }

      if (product.itemMode === 'all') {
        this.formModel.product = product
      }

      ProductItemAPI.queryRecord({ filter: { productId: product.id }, include: 'defaultPrice,prices' }).then(response => {
        let apiPayload = response.data
        let records = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        this.product = product
        this.product.items = records

        let primaryItem = _.find(records, { primary: true })
        this.productItem = primaryItem
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.product-input {
  width: 50%;
}

.product-item-input {
  width: 49.5%;
}

.price-input {
  width: 150px;
}

.order-quantity-input {
  width: 120px;
}

.charge-quantity-input {
  width: 80px;
}

.add, .estimate-switch {
  float: right;
}
</style>
