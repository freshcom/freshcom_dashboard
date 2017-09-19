<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="/product_items" mode="horizontal">
        <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
      </el-menu>
      <locale-selector></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Create a Price</span>

            <div class="pull-right">
              <el-button @click="cancel">
                Cancel
              </el-button>

              <el-button @click="submit(recordDraft)" type="primary">
                Save
              </el-button>
            </div>
          </div>

          <div class="data">
            <price-form v-model="recordDraft" :record="record" :errors="errors"></price-form>
          </div>

          <div class="children-form" v-if="recordDraft.product">
            <div v-for="child in children" class="child-row">
              <hr>

              <div class="product-item">{{child.productItem.name}}</div>

              <div class="price">
                <price-amount-input v-model="child.chargeCents" class="child-price-input">
                </price-amount-input>
                <percentage-input v-model="child.taxOnePercentage" class="child-tax-input">
                </percentage-input>
                <percentage-input v-model="child.taxTwoPercentage" class="child-tax-input">
                </percentage-input>
                <percentage-input v-model="child.taxThreePercentage" class="child-tax-input">
                </percentage-input>
              </div>
            </div>


            <div class="total">
              <hr>

              <span>Sub Total: </span> <span>${{subTotal}}</span><br>
              <span>Grand Total (After Tax): </span> <span>${{grandTotal}}</span>
            </div>
          </div>

          <div class="footer">
            <el-button @click="cancel">
              Cancel
            </el-button>

            <el-button @click="submit(recordDraft)" type="primary" class="pull-right">
              Save
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import _ from 'lodash'
import NewPage from '@/mixins/new-page'
import PriceForm from '@/components/price-form'
import ProductItemAPI from '@/api/product-item'
import JSONAPI from '@/jsonapi'
import PriceAmountInput from '@/components/price-amount-input'
import PercentageInput from '@/components/percentage-input'
import Price from '@/models/price'

export default {
  name: 'NewPrice',
  components: {
    PriceForm,
    PriceAmountInput,
    PercentageInput
  },
  data () {
    return {
      children: []
    }
  },
  mixins: [NewPage({ storeNamespace: 'price', name: 'Price' })],
  props: ['productItemId', 'productId'],
  created () {
    if (this.productItemId) {
      let record = _.cloneDeep(this.record)
      record.productItem = { id: this.productItemId, type: 'ProductItem' }
      this.$store.dispatch('price/setRecord', record)
    }

    if (this.productId) {
      let record = _.cloneDeep(this.record)
      record.product = { id: this.productId, type: 'Product' }
      this.$store.dispatch('price/setRecord', record)
    }

    if (this.session && this.productId) {
      ProductItemAPI.queryRecord({ filter: { productId: this.productId } }).then(response => {
        let apiPayload = response.data
        let records = JSONAPI.deserialize(apiPayload.data)
        this.children = _.map(records, pi => {
          return { type: 'Price', productItem: pi }
        })
      })
    }
  },
  computed: {
    session () {
      return this.$store.state.session.record
    },
    subTotalCents () {
      return _.reduce(this.children, (acc, price) => {
        let cc = price.chargeCents || 0
        return acc + cc
      }, 0)
    },
    subTotal () {
      return (this.subTotalCents / 100).toFixed(2)
    },
    grandTotalCents () {
      return _.reduce(this.children, (acc, price) => {
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
  methods: {
    recordCreated (record) {
      this.$store.dispatch('productItem/resetRecord')
      this.$store.dispatch('product/resetRecord')

      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }

      if (record.productItem) {
        return this.$store.dispatch('pushRoute', { name: 'ShowProductItem', params: { id: record.productItem.id } })
      }

      this.$store.dispatch('pushRoute', { name: 'ShowPrice', params: { id: record.id } })
    }
  },
  watch: {
    session (newSession) {
      if (!newSession) { return }

      if (this.productId) {
        ProductItemAPI.queryRecord({ filter: { productId: this.productId } }).then(response => {
          let apiPayload = response.data
          let records = JSONAPI.deserialize(apiPayload.data)
          this.children = _.map(records, pi => {
            let price = Price.objectWithDefaults()
            price.productItem = pi
            price.chargeCents = 0
            return price
          })
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
</style>
