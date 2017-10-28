<template>
<el-form @input.native="updateValue" label-position="top" label-width="180px" class="m-b-10">

  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="Customer" :error="errorMessages.customer">
        <remote-select
          v-model="formModel.customer"
          @filter="loadSelectableCustomers"
          @reset="resetSelectableCustomers"
          @input="updateValue"
          :records="selectableCustomers"
          :isLoading="isLoadingSelectableCustomers"
          :record-to-option="customerToOption"
          placeholder="Search for customer..."
          class="customer-select"
        >
        </remote-select>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="Code" :error="errorMessages.code">
        <el-input v-model="formModel.code"></el-input>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="Email" :error="errorMessages.email" required>
        <el-input v-model="formModel.email"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="Phone Number" :error="errorMessages.phoneNumber">
        <el-input v-model="formModel.phoneNumber"></el-input>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="First Name" :error="errorMessages.firstName" required>
        <el-input v-model="formModel.firstName"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="Last Name" :error="errorMessages.lastName" required>
        <el-input v-model="formModel.lastName"></el-input>
      </el-form-item>
    </el-col>
  </el-row>

  <hr class="m-t-10 m-b-10">

  <el-row>
    <el-form-item label="Fulfillment Method" :error="errorMessages.fulfillmentMethod" required>
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
        <el-form-item label="Street Address 1" :error="errorMessages.deliveryAddressLineOne" required>
          <el-input v-model="formModel.deliveryAddressLineOne"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Street Address 2" :error="errorMessages.deliveryAddressLineTwo">
          <el-input v-model="formModel.deliveryAddressLineTwo"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="6">
        <el-form-item label="City" :error="errorMessages.deliveryAddressCity" required>
          <el-input v-model="formModel.deliveryAddressCity"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Province" :error="errorMessages.deliveryAddressProvince" required>
          <el-input v-model="formModel.deliveryAddressProvince"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Country" :error="errorMessages.deliveryAddressCountryCode" required>
          <el-input v-model="formModel.deliveryAddressCountryCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Postal Code" :error="errorMessages.deliveryAddressPostalCode" required>
          <el-input v-model="formModel.deliveryAddressPostalCode"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </template>
</el-form>
</template>

<script>
import _ from 'lodash'
import errorI18nKey from '@/utils/error-i18n-key'
import RemoteSelect from '@/components/remote-select'
import CustomerSelect from '@/components/customer-select'

export default {
  name: 'OrderForm',
  props: ['value', 'errors', 'record'],
  components: {
    CustomerSelect,
    RemoteSelect
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    selectableCustomers () {
      return this.$store.state.order.selectableCustomers
    },
    isLoadingSelectableCustomers () {
      return this.$store.state.order.isLoadingSelectableCustomers
    },
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('ProductItem', k, v[0]), { name: _.startCase(k) })
        return result
      }, {})
    },
    skuErrorMessage () {
      if (this.errorMessages['relationships']) {
        return 'SKU is invalid'
      }
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
    loadSelectableCustomers: _.debounce(function (searchKeyword) {
      this.$store.dispatch('order/loadSelectableCustomers', { search: searchKeyword })
    }, 300),
    resetSelectableCustomers () {
      this.$store.dispatch('order/resetSelectableCustomers')
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
