<template>
<el-form v-loading="isLoading" @input.native="updateValue">
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

            <span v-if="price" class="m-r-10">{{price.orderUnit}}</span>

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

              <el-button type="default" @click="addProductLineItem()" :disabled="!isAddClickable">
                Add Line Item
              </el-button>
            </span>
          </div>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane label="Custom" name="customTab">
        <el-form-item>
          <div class="m-b-10">
            <el-input
              placeholder="Enter name..."
              v-model="name"
              class="name-input">
            </el-input>

            <price-amount-input class="pull-right" @change="updateValue" v-model="subTotalCents">
            </price-amount-input>
          </div>

          <div class="m-b-10">
            <price-amount-input class="m-r-10" @change="updateValue" v-model="taxOneCents">
            </price-amount-input>

            <span class="m-r-10">+</span>

            <price-amount-input class="m-r-10" @change="updateValue" v-model="taxTwoCents">
            </price-amount-input>

            <span class="m-r-10">+</span>

            <price-amount-input class="m-r-10" @change="updateValue" v-model="taxThreeCents">
            </price-amount-input>

            <span class="m-r-10">=</span>
            <price-amount-input class="pull-right" @change="updateValue" v-model="grandTotalCents" :disabled="true">
            </price-amount-input>
          </div>

          <div>
            <span class="pull-right">
              <span>Is Estimate?</span>
              <el-switch
                @change="updateValue"
                v-model="isEstimate"
                on-text="Yes"
                off-text="No">
              </el-switch>

              <el-button type="default" @click="addCustomLineItem()" :disabled="!isAddClickable">
                Add Line Item
              </el-button>
            </span>
          </div>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </div>

  <div v-if="isLineItemTableVisible" class="m-b-10">
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
        header-align="c"
        width="150px"
        label="Qty"
        prop="quantity">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="right"
        label="Amount"
        prop="subTotal">
      </el-table-column>
      <el-table-column label="" width="130px">
        <template scope="scope">
          <el-button size="mini">
            Edit
          </el-button>
          <delete-button @confirmed="deleteLineItem(scope.row.id)" size="mini">
            Delete
          </delete-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="text-right">
    <p v-if="order.subTotalCents">
      <span class="m-r-20">Sub Total:</span>
      <span v-if="order.isEstimate">~</span> <span>{{order.subTotalCents | dollar}}</span>
    </p>

    <p v-if="order.taxOneCents">
      <span class="m-r-20">Tax 1:</span>
      <span>{{order.taxOneCents | dollar}}</span>
    </p>

    <p v-if="order.taxTwoCents">
      <span class="m-r-20">Tax 2:</span>
      <span>{{order.taxTwoCents | dollar}}</span>
    </p>

    <p v-if="order.taxThreeCents">
      <span class="m-r-20">Tax 3:</span>
      <span>{{order.taxThreeCents | dollar}}</span>
    </p>

    <p v-if="order.grandTotalCents">
      <b class="m-r-20">Grand Total:</b>
      <span v-if="order.isEstimate">~</span> <span>{{order.grandTotalCents | dollar}}</span>
    </p>

    <p v-if="order.isEstimate">
      <b class="m-r-20">AA:</b>
      <span>{{order.authorizationCents | dollar}}</span>
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
      name: '',
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
      expandedLineItemIds: [],
      taxOneCents: 0,
      taxTwoCents: 0,
      taxThreeCents: 0,
      isLoading: false
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
        return this.reset()
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
        if (lineItem.isEstimate) {
          quantity += ` (~ ${lineItem.chargeQuantity}${lineItem.priceChargeUnit})`
        } else if (lineItem.priceEstimateByDefault) {
          quantity += ` (${lineItem.chargeQuantity}${lineItem.priceChargeUnit})`
        }

        let taxTotalCents = lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents
        let grandTotalCents = lineItem.subTotalCents + lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents

        let subTotal = dollar(lineItem.subTotalCents)
        if (lineItem.isEstimate) {
          subTotal = `~ ${subTotal}`
        }

        let grandTotal = dollar(grandTotalCents)
        if (lineItem.isEstimate) {
          grandTotal = `~ ${grandTotal}`
        }

        return _.concat(acc, {
          id: lineItem.id,
          name: lineItem.name,
          quantity: quantity,
          children: lineItem.children,
          subTotal: subTotal,
          taxTotal: dollar(taxTotalCents),
          grandTotal: grandTotal
        })
      }, [])
    },
    isLineItemTableVisible () {
      return this.order.rootLineItems.length > 0
    },
    grandTotalCents () {
      if (!this.subTotalCents) {
        return 0
      }

      return this.subTotalCents + this.taxOneCents + this.taxTwoCents + this.taxThreeCents
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
    reset () {
      this.product = null
      this.productItem = null
      this.price = null
      this.orderQuantity = 1
      this.chargeQuantity = null
      this.isEstimate = false
    },
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
    addProductLineItem () {
      this.isLoading = true
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
        this.reset()
        this.isLoading = false
      })
    },
    addCustomLineItem () {
      let orderLineItem = OrderLineItem.objectWithDefaults()
      orderLineItem.name = this.name
      orderLineItem.subTotalCents = this.subTotalCents
      orderLineItem.taxOneCents = this.taxOneCents
      orderLineItem.taxTwoCents = this.taxTwoCents
      orderLineItem.taxThreeCents = this.taxThreeCents
      orderLineItem.isEstimate = this.isEstimate
      orderLineItem.order = this.order
      orderLineItem.chargeQuantity = 1

      this.$store.dispatch('order/createLineItem', orderLineItem).then(() => {
        this.name = null
        this.subTotalCents = null
        this.taxOneCents = 0
        this.taxTwoCents = 0
        this.taxThreeCents = 0
      })
    },
    deleteLineItem (id) {
      let orderLineItem = _.find(this.order.rootLineItems, { id: id })
      orderLineItem = _.cloneDeep(orderLineItem)
      orderLineItem.order = this.order
      this.$store.dispatch('order/deleteLineItem', orderLineItem).then(() => {
        console.log('success')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tax-input {
  width: 25%;
}

.product-input, .name-input {
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
