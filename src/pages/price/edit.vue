<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListProduct' }">Products</router-link>
    <router-link :to="{ name: 'ListProductCollection' }">Collections</router-link>
  </div>

  <div slot="card-header">
    <h1>Edit price</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form @submit.native.prevent="submit()" label-width="180px" size="small">
            <price-fieldset v-model="priceDraft" :errors="errors"></price-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>

<!-- <div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal"  class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector @change="loadPrice()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Edit Price</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" type="primary" size="small">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <price-form v-model="priceDraft" :record="price" :errors="errors"></price-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit()" type="primary" size="small" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div> -->
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import Price from '@/models/price'
import PriceFieldset from '@/components/price-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadPrice' })

export default {
  name: 'EditPrice',
  mixins: [ResourcePageMixin],
  components: {
    PriceFieldset
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      price: Price.objectWithDefaults(),
      priceDraft: Price.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  created () {
    this.loadPrice()
  },
  methods: {
    loadPrice () {
      this.isLoading = true

      return freshcom.retrievePrice(this.id, {
        include: 'product'
      }).then(response => {
        this.price = response.data
        this.priceDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdating = true

      freshcom.updatePrice(this.priceDraft.id, this.priceDraft).then(price => {
        this.$message({
          showClose: true,
          message: `Price saved successfully.`,
          type: 'success'
        })

        this.isUpdating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ShowPrice', params: { id: this.price.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
