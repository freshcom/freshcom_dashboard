<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'ListCustomer' }">Customers</router-link>
  </div>

  <div slot="card-header">
    <h1>Create a customer</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form @submit.native.prevent="submit()" label-width="100px" size="small">
            <customer-fieldset v-model="customerDraft" :errors="errors"></customer-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Customer from '@/models/customer'
import CustomerFieldset from '@/components/customer-fieldset'

import PageMixin from '@/mixins/page'

export default {
  name: 'NewCustomer',
  mixins: [PageMixin],
  components: {
    CustomerFieldset
  },
  data () {
    return {
      customerDraft: Customer.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreating = true

      freshcom.createCustomer(this.customerDraft).then(customer => {
        this.$message({
          showClose: true,
          message: `Customer created successfully.`,
          type: 'success'
        })

        this.isCreating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListCustomer' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
