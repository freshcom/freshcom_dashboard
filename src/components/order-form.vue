<template>
<el-form @input.native="updateValue" label-position="top" size="small" class="m-b-10">
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item v-if="canSelectCustomer" label="Customer" :error="errorMsgs.customer">
        <remote-select
          :value="formModel.customer"
          :search-method="searchCustomers"
          :record-to-option="customerToOption"
          @change="handleCustomerChange($event)"
          placeholder="Type to start searching..."
          class="customer-select"
        >
        </remote-select>
      </el-form-item>
      <el-form-item v-if="!canSelectCustomer && formModel.customer" label="Customer">
        <b>{{formModel.customer.firstName}} {{formModel.customer.lastName}}</b>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="Code" :error="errorMsgs.code">
        <el-input v-model="formModel.code"></el-input>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="Email" :error="errorMsgs.email" required>
        <el-input v-model="formModel.email"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="Phone Number" :error="errorMsgs.phoneNumber">
        <el-input v-model="formModel.phoneNumber"></el-input>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="First Name" :error="errorMsgs.firstName" required>
        <el-input v-model="formModel.firstName"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="Last Name" :error="errorMsgs.lastName" required>
        <el-input v-model="formModel.lastName"></el-input>
      </el-form-item>
    </el-col>
  </el-row>

  <hr class="m-t-10 m-b-10">

  <el-row>
    <el-form-item label="Fulfillment Method" :error="errorMsgs.fulfillmentMethod" required>
      <el-select @change="updateValue" v-model="formModel.fulfillmentMethod">
        <el-option label="Ship" value="ship"></el-option>
        <el-option label="Pick Up" value="pickup"></el-option>
        <el-option label="Digital" value="digital"></el-option>
      </el-select>
    </el-form-item>
  </el-row>

  <template v-if="formModel.fulfillmentMethod === 'ship'">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Street Address 1" :error="errorMsgs.deliveryAddressLineOne" required>
          <el-input v-model="formModel.deliveryAddressLineOne"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Street Address 2" :error="errorMsgs.deliveryAddressLineTwo">
          <el-input v-model="formModel.deliveryAddressLineTwo"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="6">
        <el-form-item label="City" :error="errorMsgs.deliveryAddressCity" required>
          <el-input v-model="formModel.deliveryAddressCity"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Province" :error="errorMsgs.deliveryAddressProvince" required>
          <el-input v-model="formModel.deliveryAddressProvince"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Country" :error="errorMsgs.deliveryAddressCountryCode" required>
          <el-input v-model="formModel.deliveryAddressCountryCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Postal Code" :error="errorMsgs.deliveryAddressPostalCode" required>
          <el-input v-model="formModel.deliveryAddressPostalCode"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </template>
</el-form>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import translateErrors from '@/helpers/translate-errors'
import RemoteSelect from '@/components/remote-select'

export default {
  name: 'OrderForm',
  props: ['value', 'errors', 'record', 'canSelectCustomer'],
  components: {
    RemoteSelect
  },
  data () {
    return {
      isLoadingCustomers: false,
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'order')
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),

    handleCustomerChange (customer) {
      if (customer) {
        this.formModel.customer = customer
      } else {
        this.formModel.customer = null
      }

      this.$emit('input', this.formModel)
    },

    searchCustomers (keyword) {
      return freshcom.listCustomer({
        search: keyword
      }).then(response => {
        return response.data
      })
    },

    customerToOption (customer) {
      if (!customer) {
        return { value: undefined }
      }

      let info = ''
      if (customer.code) {
        info += `[${customer.code}] `
      }
      if (!customer.firstName && !customer.lastName) {
        info += `Anonymous`
      } else {
        info += [customer.firstName, customer.lastName].join(' ')
      }

      info += ' :: ' + customer.status
      return { value: customer.id, label: info }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form-item {
  margin: 10px 0;
}

.customer-select {
  width: 100%;
}

.name-input {
  width: 49.6%;
}
</style>
