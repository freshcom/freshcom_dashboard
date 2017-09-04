<template>
<el-form @input.native="updateValue" label-width="180px">
  <el-form-item v-if="record.productItem" label="Product Item">
    {{formModel.productItem.id}}
  </el-form-item>

  <hr>

  <el-form-item label="Code" :error="errorMessages.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.id" label="Status" :error="errorMessages.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMessages.name">
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMessages.label" required>
    <el-input v-model="formModel.label"></el-input>
  </el-form-item>

  <el-form-item label="Charge Amount" :error="chargeAmountError" required>
    <price-amount-input @change="updateValue" v-model="formModel.chargeCents">
    </price-amount-input>
    <span> / </span>
    <el-input v-model="formModel.chargeUnit" class="unit-input" placeholder="Unit"></el-input>
  </el-form-item>

  <el-form-item label="Public Orderable" :error="errorMessages.publicOrderable" required>
    <el-switch
      @change="updateValue"
      v-model="formModel.publicOrderable"
      on-text="Yes"
      off-text="No">
    </el-switch>
  </el-form-item>

  <el-form-item label="Estimate By Default" :error="errorMessages.estimateByDefault" required>
    <el-switch
      @change="updateValue"
      v-model="formModel.estimateByDefault"
      on-text="Yes"
      off-text="No">
    </el-switch>
  </el-form-item>

  <el-form-item v-if="formModel.estimateByDefault" label="Order Unit" :error="errorMessages.orderUnit" required>
    <el-input v-model="formModel.orderUnit" class="unit-input"></el-input>
  </el-form-item>

  <el-form-item  v-if="formModel.estimateByDefault" :error="errorMessages.estimateAveragePercentage" label="Estimate Average" required>
    <percentage-input v-model="formModel.estimateAveragePercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item  v-if="formModel.estimateByDefault" :error="errorMessages.estimateMaximumPercentage" label="Estimate Maximum" required>
    <percentage-input v-model="formModel.estimateMaximumPercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Minimum Order Quantity" required>
    <el-input-number @change="updateValue" v-model="formModel.minimumOrderQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Source Quantity" :error="errorMessages.sourceQuantity" required>
    <el-input-number @change="updateValue" v-model="formModel.sourceQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Tax One" required>
    <percentage-input v-model="formModel.taxOnePercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Tax Two" required>
    <percentage-input v-model="formModel.taxTwoPercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Tax Three" required>
    <percentage-input v-model="formModel.taxThreePercentage">
    </percentage-input>
  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import PriceAmountInput from '@/components/price-amount-input'
import PercentageInput from '@/components/percentage-input'

export default {
  name: 'PriceForm',
  components: {
    PriceAmountInput,
    PercentageInput
  },
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(`errors.${v[0]}`, { name: _.startCase(k) })
        return result
      }, {})
    },
    chargeAmountError () {
      if (this.errorMessages.chargeCents) {
        return this.errorMessages.chargeCents
      }

      if (this.errorMessages.chargeUnit) {
        return this.errorMessages.chargeUnit
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
    }, 300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.unit-input {
  width: 100px;
}
.ratio-input {
  width: 100px;
}
</style>
