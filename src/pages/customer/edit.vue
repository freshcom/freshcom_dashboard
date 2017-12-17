<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/customers" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListCustomer' }" index="/customers">Customers</el-menu-item>
    </el-menu>
    <locale-selector @change="loadCustomer()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>
        <span style="line-height: 36px;">Edit Customer</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" size="small" type="primary">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <customer-form v-model="customerDraft" :errors="errors"></customer-form>
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

</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import Customer from '@/models/customer'
import CustomerForm from '@/components/customer-form'

export default {
  name: 'EditCustomer',
  mixins: [PageMixin],
  components: {
    CustomerForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      customer: Customer.objectWithDefaults(),
      customerDraft: Customer.objectWithDefaults(),

      isUpdatingCustomer: false,
      errors: {}
    }
  },
  created () {
    this.loadCustomer()
  },
  methods: {
    loadCustomer () {
      this.isLoading = true

      freshcom.retrieveCustomer(this.id).then(response => {
        this.customer = response.data
        this.customerDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(response => {
        this.errors = response.errors
        this.isLoading = false

        throw response
      })
    },

    submit () {
      this.isUpdatingCustomer = true

      freshcom.updateCustomer(this.customerDraft.id, this.customerDraft).then(() => {
        this.$message({
          showClose: true,
          message: `Customer saved successfully.`,
          type: 'success'
        })

        this.isUpdatingCustomer = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingCustomer = false

        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowCustomer', params: { id: this.customer.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
