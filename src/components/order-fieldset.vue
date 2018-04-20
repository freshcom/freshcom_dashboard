<template>
<div class="component-wrapper order-fieldset">
  <el-form-item label="Customer" :error="errorMsgs.customer">
    <customer-select v-model="formModel.customer" :disabled="formModel.status !== 'cart'" @input="updateValue()"></customer-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Email" :error="errorMsgs.email">
    <el-input v-model="formModel.email" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Phone Number" :error="errorMsgs.phoneNumber">
    <el-input v-model="formModel.phoneNumber" @input="updateValue()"></el-input>
  </el-form-item>

  <hr class="m-t-10 m-b-10">

  <el-form-item label="Fulfillment Method" :error="errorMsgs.fulfillmentMethod" required>
    <el-select v-model="formModel.fulfillmentMethod" @change="updateValue()">
      <el-option label="Ship" value="ship"></el-option>
      <el-option label="Pick Up" value="pickup"></el-option>
      <el-option label="Digital" value="digital"></el-option>
    </el-select>
  </el-form-item>


  <template v-if="formModel.fulfillmentMethod === 'ship'">
    <el-form-item label="Address" :error="errorMsgs.deliveryAddressLineOne" required>
      <el-input v-model="formModel.deliveryAddressLineOne" @input="updateValue()" placeholder="Street address line 1"></el-input>
    </el-form-item>

    <el-form-item :error="errorMsgs.deliveryAddressLineTwo">
      <el-input v-model="formModel.deliveryAddressLineTwo" @input="updateValue()" placeholder="Street address line 2"></el-input>
    </el-form-item>

    <div class="form-item-wrapper multi-per-line">
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label-width="0px" :error="errorMsgs.deliveryAddressCity">
              <el-input v-model="formModel.deliveryAddressCity" @input="updateValue()" placeholder="City"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="0px">
              <el-input v-model="formModel.deliveryAddressProvince" @input="updateValue()" placeholder="Province/State"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label-width="0px" :error="errorMsgs.deliveryAddressCountryCode">
              <el-input v-model="formModel.deliveryAddressCountryCode" @input="updateValue()" placeholder="Country"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="0px">
              <el-input v-model="formModel.deliveryAddressPostalCode" @input="updateValue()" placeholder="Postal Code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </div>
  </template>
</div>
</template>

<script>
import CustomerSelect from '@/components/customer-select'
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'unlockable' })

export default {
  name: 'OrderForm',
  mixins: [FieldsetMixin],
  components: {
    CustomerSelect
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
