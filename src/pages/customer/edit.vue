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
import Customer from '@/models/customer'
import CustomerForm from '@/components/customer-form'

export default {
  name: 'EditCustomer',
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

      this.$store.dispatch('customer/getCustomer', {
        id: this.id
      }).then(customer => {
        this.customer = customer
        this.customerDraft = _.cloneDeep(customer)

        this.isLoading = false
      }).catch(errors => {
        this.errors = errors
        this.isLoading = false

        throw errors
      })
    },

    submit () {
      this.isUpdatingCustomer = true

      this.$store.dispatch('customer/updateCustomer', {
        id: this.customerDraft.id,
        customerDraft: this.customerDraft
      }).then(customer => {
        this.$message({
          showClose: true,
          message: `Customer saved successfully.`,
          type: 'success'
        })

        this.isUpdatingCustomer = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isUpdatingCustomer = false
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
