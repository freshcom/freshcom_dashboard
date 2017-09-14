<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="/orders" mode="horizontal">
        <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
      </el-menu>
      <locale-selector></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Create a Order</span>

            <div class="pull-right">
              <el-button @click="cancel">
                Cancel
              </el-button>

              <el-button @click="submit(recordDraft)" type="primary">
                Next
              </el-button>
            </div>
          </div>

          <div class="step-indicator">
            <el-steps :space="200" :active="0" :align-center="true" finish-status="success">
              <el-step title="Line Items"></el-step>
              <el-step title="Information"></el-step>
              <el-step title="Payment"></el-step>
            </el-steps>
          </div>

          <div class="data">
            <order-line-item-form :order="recordDraft" :errors="errors">
            </order-line-item-form>
          </div>

          <div class="footer">
            <el-button @click="cancel">
              Cancel
            </el-button>

            <el-button @click="submit(recordDraft)" type="primary" class="pull-right">
              Next
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import NewPage from '@/mixins/new-page'
import OrderLineItemForm from '@/components/order-line-item-form'

export default {
  name: 'NewOrder',
  components: {
    OrderLineItemForm
  },
  mixins: [NewPage({ storeNamespace: 'order', name: 'Order' })],
  methods: {
    recordCreated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowOrder', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.step-indicator {
  margin-left: 175px;
  margin-top: 20px;
}
</style>
