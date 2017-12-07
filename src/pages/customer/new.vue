<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/customers" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListCustomer' }" index="/customers">Customers</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a customer</span>

        <div class="pull-right">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" type="primary" size="small">
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
import freshcom from '@/freshcom-sdk'

import Customer from '@/models/customer'
import CustomerForm from '@/components/customer-form'

export default {
  name: 'NewCustomer',
  components: {
    CustomerForm
  },
  data () {
    return {
      customerDraft: Customer.objectWithDefaults(),
      isCreatingCustomer: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreatingCustomer = true

      freshcom.createCustomer(this.customerDraft).then(customer => {
        this.$message({
          showClose: true,
          message: `Customer created successfully.`,
          type: 'success'
        })

        this.isCreatingCustomer = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingCustomer = false
        throw response
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListCustomer' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
