<template>
<el-form @input.native="updateValue">
  <div class="m-b-10">

    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="Product" name="productTab">
        <el-form-item>
          <div class="m-b-10">
            <product-select v-model="product" :filter="{ status: ['active', 'internal'] }" include="prices,defaultPrice" class="product-input">
            </product-select>

            <el-select @change="updateValue" :disabled="!isProductItemSelectable" :placeholder="productItemPlaceholder" v-model="productItem" value-key="id" class="product-item-input">
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
            <el-select @change="updateValue" v-model="price" value-key="id" placeholder="" :disabled="!price" class="price-input">
              <el-option v-for="price in selectablePrices" :key="price.id" v-bind:label="price | chargeDollar" :value="price">
                <span v-if="price.name">{{price.name}} -</span>
                <span>{{price | chargeDollar}}</span>
              </el-option>
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

              <el-button type="default" @click="add()" :disabled="!isAddClickable">
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

  <div class="m-b-10">
    <el-table :data="tableData" @expand="lineItemExpanded" row-key="id" :expand-row-keys="expandedLineItemIds" class="nested-table" style="width: 100%">
      <el-table-column type="expand" width="40px">
        <template scope="props">
          <el-table :data="props.row.children" :show-header="false" style="width: 100%">
            <el-table-column width="50px" label="" prop="">
            </el-table-column>
            <el-table-column width="300px" label="Name" prop="name">
            </el-table-column>
            <el-table-column width="150px" label="Qty" prop="orderQuantity">
            </el-table-column>
            <el-table-column label="$" prop="subTotal">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        width="300px"
        label="Name"
        prop="name">
      </el-table-column>
      <el-table-column
        width="150px"
        label="Qty"
        prop="quantity">
      </el-table-column>
      <el-table-column
        label="$"
        prop="subTotal">
      </el-table-column>
      <el-table-column label="" width="130px">
        <template scope="scope">
          <el-button size="mini">
            Edit
          </el-button>
          <delete-button @confirmed="deleteLineItem(scope.id)" size="mini">
            Delete
          </delete-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div style="text-align: right;">
    <p v-if="order.subTotalCents">
      <b>Sub Total:</b> <span>{{order.subTotalCents | dollar}}</span>
    </p>

    <p v-if="order.taxOneCents">
      <b>Tax 1:</b> <span>{{order.taxOneCents | dollar}}</span>
    </p>

    <p v-if="order.taxTwoCents">
      <b>Tax 2:</b> <span>{{order.taxTwoCents | dollar}}</span>
    </p>

    <p v-if="order.taxThreeCents">
      <b>Tax 3:</b> <span>{{order.taxThreeCents | dollar}}</span>
    </p>

    <p v-if="order.grandTotalCents">
      <b>Grand Total:</b> <span>{{order.grandTotalCents | dollar}}</span>
    </p>
  </div>

</el-form>
</template>

<script>
import _ from 'lodash'
import JSONAPI from '@/jsonapi'
import ProductItemAPI from '@/api/product-item'
import { chargeDollar, dollar } from '@/helpers/filters'

import Price from '@/models/price'
import OrderLineItem from '@/models/order-line-item'

import ProductItemSelect from '@/components/product-item-select'
import ProductSelect from '@/components/product-select'
import PriceAmountInput from '@/components/price-amount-input'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'OrderLineItemForm',
  props: ['order'],
  filters: {
    chargeDollar,
    dollar
  },
  components: {
    ProductItemSelect,
    ProductSelect,
    PriceAmountInput,
    DeleteButton
  },
  data () {
    return {
      product: null,
      productItems: [],
      productItem: null,
      price: null,
      prices: [],
      isEstimate: false,
      orderQuantity: 1,
      chargeQuantity: null,
      subTotalCents: null,
      activeTab: 'productTab',
      expandedLineItemIds: []
    }
  },
  watch: {
    productItem (productItem) {
      if (productItem) {
        this.price = productItem.defaultPrice
        this.prices = productItem.prices
        return
      }
    },
    product (product) {
      if (!product) {
        this.product = null
        this.productItem = null
        this.price = null
        return
      }

      if (product && product.itemMode === 'all') {
        this.price = product.defaultPrice
        this.prices = product.prices
      }

      if (product && product.itemMode === 'any') {
        ProductItemAPI.queryRecord({ filter: { productId: product.id, status: ['active', 'internal'] }, include: 'defaultPrice,prices' }).then(response => {
          let apiPayload = response.data
          let records = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
          this.product = product
          this.product.items = records

          return records
        }).then(productItems => {
          let primaryItem = _.find(productItems, { primary: true })
          this.productItem = primaryItem
        })
      }
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
        this.price = Price.getLowestPrice(this.prices, orderQuantity, this.price.status)
      }
    }
  },
  computed: {
    tableData () {
      return _.reduce(this.order.rootLineItems, (acc, lineItem) => {
        let quantity = `${lineItem.orderQuantity}`
        if (lineItem.priceEstimateByDefault) {
          quantity += ` (${lineItem.chargeQuantity}${lineItem.priceChargeUnit})`
        }
        let taxTotalCents = lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents
        let grandTotalCents = lineItem.subTotalCents + lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents

        return _.concat(acc, {
          id: lineItem.id,
          name: lineItem.name,
          quantity: quantity,
          children: lineItem.children,
          subTotal: dollar(lineItem.subTotalCents),
          taxTotal: dollar(taxTotalCents),
          grandTotal: dollar(grandTotalCents)
        })
      }, [])
    },
    isProductItemSelectable () {
      if (!this.product || this.product.itemMode === 'all') {
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
      if (this.product && this.product.itemMode === 'all') {
        return 'All'
      } else {
        return 'Select product first...'
      }
    },
    selectablePrices () {
      if (this.productItem || (this.product && this.product.itemMode === 'all')) {
        let prices
        if (this.productItem) {
          prices = this.productItem.prices
        } else {
          prices = this.product.prices
        }

        let lowestActivePrice = Price.getLowestPrice(prices, this.orderQuantity, 'active')
        let internalPrices = _.filter(prices, (price) => {
          return price.status === 'internal' && price.minimumOrderQuantity <= this.price.minimumOrderQuantity
        })

        if (lowestActivePrice) {
          return _.concat(lowestActivePrice, internalPrices)
        }
        return internalPrices
      }

      return []
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    lineItemExpanded (row) {
      if (row.children && (row.children.length > 0) && !_.includes(this.expandedLineItemIds, row.id)) {
        this.expandedLineItemIds = [row.id]
        return
      }
      this.expandedLineItemIds = []
    },
    refreshChargeQuantity (subTotalCents) {
      if (this.price && this.price.estimateByDefault) {
        this.chargeQuantity = subTotalCents / this.price.chargeCents
      }
    },
    add () {
      let orderLineItem = OrderLineItem.objectWithDefaults()
      if (this.product.itemMode === 'all') {
        orderLineItem.product = this.product
      } else {
        orderLineItem.productItem = this.productItem
      }

      orderLineItem.price = this.price
      orderLineItem.orderQuantity = this.orderQuantity
      orderLineItem.isEstimate = this.isEstimate
      orderLineItem.chargeQuantity = this.chargeQuantity
      orderLineItem.order = this.order

      this.$store.dispatch('order/createLineItem', orderLineItem).then(() => {
        this.product = null
        this.productItem = null
        this.price = null
      })
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

<style>
.nested-table .el-table__expanded-cell {
  padding: 0px;
}
</style>
