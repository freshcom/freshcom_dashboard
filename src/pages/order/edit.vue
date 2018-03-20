<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListOrder'}">Orders</router-link>
  </div>

  <div slot="card-header">
    <h1>Edit order</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form @submit.native.prevent="submit()" label-width="140px" size="small">
            <order-fieldset v-model="orderDraft" :errors="errors"></order-fieldset>
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
    <el-menu :router="true" default-active="/orders" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
    </el-menu>
    <locale-selector @change="loadOrder()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>
        <span style="line-height: 36px;">Edit Order</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <order-form v-model="orderDraft" :can-select-customer="false" :errors="errors"></order-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button :loading="isUpdating" @click="submit()" type="primary" size="small" class="pull-right">
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

import Order from '@/models/order'
import OrderFieldset from '@/components/order-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadOrder' })

export default {
  name: 'EditOrder',
  mixins: [ResourcePageMixin],
  components: {
    OrderFieldset
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
      order: Order.objectWithDefaults(),
      orderDraft: Order.objectWithDefaults(),

      isUpdating: false,

      errors: {}
    }
  },
  methods: {
    loadOrder () {
      this.isLoading = true

      return freshcom.retrieveOrder(this.id, {
        include: 'customer'
      }).then(response => {
        this.order = response.data
        this.orderDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
        throw response
      })
    },

    submit () {
      this.isUpdating = true

      freshcom.updateOrder(this.orderDraft.id, this.orderDraft).then(() => {
        this.$message({
          showClose: true,
          message: `Order saved successfully.`,
          type: 'success'
        })

        this.isUpdating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdating = false
      })
    },

    defaultBack () {
      return this.$store.dispatch('pushRoute', { name: 'ShowOrder', params: { id: this.order.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
