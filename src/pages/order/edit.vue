<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/orders" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
    </el-menu>
    <locale-selector @change="loadOrder()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Edit Order</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button :loading="isUpdatingOrder" @click="submit()" type="primary" size="small">
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

        <el-button :loading="isUpdatingOrder" @click="submit()" type="primary" size="small" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import _ from 'lodash'
import Order from '@/models/order'
import OrderForm from '@/components/order-form'

export default {
  name: 'EditOrder',
  components: {
    OrderForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      order: Order.objectWithDefaults(),
      orderDraft: Order.objectWithDefaults(),

      isUpdatingOrder: false,

      errors: {}
    }
  },
  created () {
    this.loadOrder()
  },
  methods: {
    loadOrder () {
      this.isLoading = true

      this.$store.dispatch('order/getOrder', {
        id: this.id,
        include: 'customer'
      }).then(order => {
        this.order = order
        this.orderDraft = _.cloneDeep(order)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdatingOrder = true
      this.$store.dispatch('order/updateOrder', { id: this.orderDraft.id, orderDraft: this.orderDraft }).then(order => {
        this.$message({
          showClose: true,
          message: `Order saved successfully.`,
          type: 'success'
        })

        this.isUpdatingOrder = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isUpdatingOrder = false
      })
    },

    back () {
      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }

      return this.$store.dispatch('pushRoute', { name: 'ShowOrder', params: { id: this.order.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
