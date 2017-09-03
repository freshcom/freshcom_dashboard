<template>
<el-form @input.native="updateValue" label-width="180px">
  <el-form-item v-if="record.productItem" label="Product Item">
    {{formModel.productItem.id}}
  </el-form-item>

  <hr>

  <el-form-item label="Code" :error="errorMessages.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Label">
    <el-input v-model="formModel.label"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.id" label="Status" :error="errorMessages.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Charge Amount" :error="errorMessages.chargeCents" required>
    <price-amount-input @change="updateValue" v-model="formModel.chargeCents">
    </price-amount-input>
    <span> / </span>
    <el-input v-model="formModel.chargeUnit" class="unit-input" placeholder="Unit"></el-input>
  </el-form-item>

  <el-form-item label="Estimate By Default" :error="errorMessages.estimateByDefault" required>
    <el-switch
      v-model="formModel.estimateByDefault"
      on-text="Yes"
      off-text="No">
    </el-switch>
  </el-form-item>

  <el-form-item v-if="formModel.estimateByDefault" label="Order Unit" :error="errorMessages.orderUnit" required>
    <el-input v-model="formModel.orderUnit" class="unit-input"></el-input>
  </el-form-item>

  <el-form-item  v-if="formModel.estimateByDefault" label="Estimate Average" required>
    <percentage-input @change="updateValue" v-model="formModel.estimateAveragePercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item  v-if="formModel.estimateByDefault" label="Estimate Maximum" required>
    <percentage-input @change="updateValue" v-model="formModel.estimateMaximumPercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Minimum Order Quantity" required>
    <el-input-number @change="updateValue" v-model="formModel.minimumOrderQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Source Quantity" :error="errorMessages.sourceQuantity" required>
    <el-input-number @change="updateValue" v-model="formModel.sourceQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Tax One" required>
    <percentage-input @change="updateValue" v-model="formModel.taxOnePercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Tax Two" required>
    <percentage-input @change="updateValue" v-model="formModel.taxTwoPercentage">
    </percentage-input>
  </el-form-item>

  <el-form-item label="Tax Three" required>
    <percentage-input @change="updateValue" v-model="formModel.taxThreePercentage">
    </percentage-input>
  </el-form-item>

  {{formModel}}
</el-form>
</template>

<script>
import _ from 'lodash'
import PriceAmountInput from '@/components/price-amount-input'
import PercentageInput from '@/components/percentage-input'

export default {
  name: 'ProductItemForm',
  components: {
    PriceAmountInput,
    PercentageInput
  },
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      productChoice: '',
      sourceType: 'Sku',
      imageUrl: '',
      pendingAvatarId: ''
    }
  },
  computed: {
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(`errors.${v[0]}`, { name: _.startCase(k) })
        return result
      }, {})
    },
    skuErrorMessage () {
      if (this.errorMessages['relationships']) {
        return 'SKU is invalid'
      } else {
        return
      }
    },
    avatarUrl () {
      if (!this.formModel.avatar) {
        return
      }

      if (this.formModel.avatar.status === 'uploaded') {
        return this.formModel.avatar.url
      }

      return URL.createObjectURL(this.formModel.avatar.file)
    },
    pendingAvatar () {
      return _.find(this.$store.state.externalFile.pendingRecords, (externalFile) => { return externalFile.id === this.pendingAvatarId })
    },
    uploadedAvatar () {
      return _.find(this.$store.state.externalFile.uploadedRecords, (externalFile) => { return externalFile.id === this.pendingAvatarId })
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    },
    uploadedAvatar (externalFile) {
      if (!externalFile) {
        return
      }

      this.$store.dispatch('externalFile/popUploadedRecords', [externalFile])
      this.formModel = _.merge({}, this.formModel, { avatar: externalFile })
      this.updateValue()
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    beforeAvatarUpload () {

    },
    handleAvatarSuccess () {

    },
    querySku () {

    },
    setSku (id) {
      if (id) {
        this.formModel.sku = { id: id, type: 'Sku' }
      } else {
        this.formModel.sku = {}
      }
      this.updateValue()
    },
    setProduct (id) {
      if (id) {
        this.formModel.product = { id: id, type: 'Product' }
      } else {
        delete this.formModel.product
      }
      this.updateValue()
    },
    uploadAvatar (e) {
      let file = e.file
      let externalFile = { type: 'ExternalFile', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }
      this.$store.dispatch('externalFile/pushPendingRecords', [externalFile]).then(externalFiles => {
        this.pendingAvatarId = externalFiles[0].id
      })
    }
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
