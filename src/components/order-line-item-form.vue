<template>
<el-form @input.native="updateValue">
  <div class="m-b-10">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="Product" name="productTab">
        <el-form-item>
          <div class="m-b-10">
            <product-select @select="setProduct" :filter="{ status: ['active', 'internal'] }" class="product-input">
            </product-select>

            <el-select @change="updateValue" :disabled="!isProductItemSelectable" placeholder="Select product first..." v-model="productItem" value-key="id" class="product-item-input">
              <template v-if="product">
                <el-option v-for="item in product.items" :key="item.id" :label="item.name" :value="item">
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
            <el-select @change="updateValue" v-model="price" value-key="id" placeholder="$xx.xx/xx" :disabled="!productItem" class="price-input">
              <template v-if="productItem">
                <el-option v-for="price in prices" :key="price.id" :label="chargePriceStr(price)" :value="price">
                  <span v-if="price.name">{{price.name}} -</span>
                  <span>{{chargePriceStr(price)}}</span>
                </el-option>
              </template>
            </el-select>

            <div class="pull-right">
              <span class="m-r-10">=</span>

              <price-amount-input @change="updateValue" @input="refreshChargeQuantity" v-model="subTotalCents" :disabled="!price || !price.estimateByDefault">
              </price-amount-input>
            </div>
          </div>

          <div>

            <span class="pull-right">
              <span>Is Estimate?</span>
              <el-switch
                @change="updateValue"
                v-model="isEstimate"
                :disabled="!isIsEstimateTogglable"
                on-text="Yes"
                off-text="No">
              </el-switch>

              <el-button type="default" :disabled="!isAddClickable">
                Add
              </el-button>
            </span>
          </div>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane label="Custom" name="customTab">

      </el-tab-pane>
    </el-tabs>
  </div>

  <div>
    <el-table
      :data="[]"
      style="width: 100%">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="商品 ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="desc">
      </el-table-column>
    </el-table>
  </div>


</el-form>
</template>

<script>
import _ from 'lodash'
import JSONAPI from '@/jsonapi'
import ProductItemAPI from '@/api/product-item'

import Price from '@/models/price'

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
      price: null,
      isEstimate: false,
      orderQuantity: 1,
      chargeQuantity: null,
      subTotalCents: null,
      activeTab: 'productTab'
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    },
    productItem (productItem) {
      if (productItem) {
        this.price = productItem.defaultPrice
        return
      }

      this.price = null
    },
    price (price) {
      if (price && price.estimateByDefault) {
        this.chargeQuantity = this.orderQuantity * (price.estimateAveragePercentage / 100)
        this.isEstimate = true
        return
      }

      if (price && !price.estimateByDefault) {
        this.chargeQuantity = null
        this.subTotalCents = this.orderQuantity * this.price.chargeCents
        return
      }

      this.subTotalCents = null
    },
    chargeQuantity (chargeQuantity) {
      if (chargeQuantity && this.price && this.price.estimateByDefault) {
        this.subTotalCents = chargeQuantity * this.price.chargeCents
      }
    },
    orderQuantity (orderQuantity) {
      if (this.price && !this.price.estimateByDefault) {
        this.subTotalCents = orderQuantity * this.price.chargeCents
      }

      if (this.price && this.price.estimateByDefault) {
        this.chargeQuantity = this.orderQuantity * (this.price.estimateAveragePercentage / 100)
      }

      if (this.price) {
        this.price = Price.getLowestPrice(this.productItem.prices, orderQuantity, this.price.status)
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
    isIsEstimateTogglable () {
      if (this.price && this.price.estimateByDefault) {
        return true
      }

      false
    },
    isAddClickable () {
      if (this.subTotalCents) {
        return true
      }

      return false
    },
    productItemPlaceholder () {
      if (this.isProductItemSelectable) {
        return 'Select product first...'
      } else {
        return 'All'
      }
    },
    prices () {
      if (this.productItem) {
        let prices = this.productItem.prices
        let lowestActivePrice = Price.getLowestPrice(prices, this.orderQuantity, 'active')
        let internalPrices = _.filter(this.productItem.prices, (price) => {
          return price.status === 'internal' && price.minimumOrderQuantity <= this.price.minimumOrderQuantity
        })

        if (lowestActivePrice) {
          return _.concat(lowestActivePrice, internalPrices)
        }
        return internalPrices
      }
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    chargePriceStr (price) {
      return `$${price.chargeCents / 100}/${price.chargeUnit}`
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

      ProductItemAPI.queryRecord({ filter: { productId: product.id, status: ['active', 'internal'] }, include: 'defaultPrice,prices' }).then(response => {
        let apiPayload = response.data
        let records = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        this.product = product
        this.product.items = records

        let primaryItem = _.find(records, { primary: true })
        this.productItem = primaryItem
      })
    },
    refreshChargeQuantity (subTotalCents) {
      if (this.price && this.price.estimateByDefault) {
        this.chargeQuantity = subTotalCents / this.price.chargeCents
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.product-input {
  width: 49.9%;
}

.product-item-input {
  width: 49.5%;
}

.price-input {
  width: 200px;
}

.order-quantity-input {
  width: 120px;
}

.charge-quantity-input {
  width: 60px;
}

.add, .estimate-switch {
  float: right;
}

.el-tabs--border-card {
  box-shadow: none;
}

.el-tabs__content {
  padding: 0px;
}

.el-tabs .el-form-item {
  margin: 0px;
}
</style>
