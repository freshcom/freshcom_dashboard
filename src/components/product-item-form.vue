<template>
<el-form @input.native="updateValue" label-width="180px">
  <el-form-item v-if="record.product" label="Product">
    {{formModel.product.id}}
  </el-form-item>

  <el-form-item v-if="!record.id" label="Source Type" required>
    <el-select v-model="sourceType" @change="clearSource()">
      <el-option label="SKU" value="sku"></el-option>
      <el-option label="Unlockable" value="unlockable"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item v-if="sourceType == 'sku' && !record.id" :error="skuErrorMessage" label="SKU" required>
    <remote-select
      v-model="formModel.sku"
      @filter="loadSelectableSkus"
      @reset="resetSelectableSkus"
      @input="updateValue"
      :records="selectableSkus"
      :isLoading="isLoadingSelectableSkus"
      placeholder="Select SKU"
      class="source-select"
    >
    </remote-select>
  </el-form-item>

  <el-form-item v-if="sourceType == 'unlockable' && !record.id" label="Unlockable" :error="unlockableErrorMessage" required>
    <remote-select
      v-model="formModel.unlockable"
      @filter="loadSelectableUnlockables"
      @reset="resetSelectableUnlockables"
      @input="updateValue"
      :records="selectableUnlockables"
      :isLoading="isLoadingSelectableUnlockables"
      placeholder="Select Unlockable"
      class="source-select"
    >
    </remote-select>
  </el-form-item>

  <el-form-item v-if="record.sku" label="SKU">
    {{formModel.sku.id}}
  </el-form-item>

  <hr>

  <el-form-item label="Code" :error="errorMessages.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.id" label="Status" :error="errorMessages.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name Sync" required>
    <el-radio-group @change="updateValue" v-model="formModel.nameSync">
      <el-radio label="disabled">Disabled</el-radio>
      <el-radio label="sync_with_source">Sync with source</el-radio>
      <el-radio label="sync_with_product">Sync with product</el-radio>
    </el-radio-group>
  </el-form-item>

  <el-form-item v-if="formModel.nameSync == 'disabled'" label="Name" :error="errorMessages.name" required>
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.nameSync == 'sync_with_product'" label="Short Name" :error="errorMessages.name">
    <el-input v-model="formModel.shortName"></el-input>
  </el-form-item>

  <el-form-item label="Source Quantity" :error="errorMessages.sourceQuantity" required>
    <el-input-number @change="updateValue" v-model="formModel.sourceQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Sort Index" :error="errorMessages.sortIndex" required>
    <el-input-number @change="updateValue" v-model="formModel.sortIndex" :min="0" :step="100"></el-input-number>
  </el-form-item>

  <el-form-item label="Maximum PO Quantity" :error="errorMessages.maximumPublicOrderQuantity" required>
    <el-input-number @change="updateValue" v-model="formModel.maximumPublicOrderQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Caption">
    <el-input v-model="formModel.caption"></el-input>
  </el-form-item>

  <el-form-item label="Description">
    <el-input type="textarea" v-model="formModel.description"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import RemoteSelect from '@/components/remote-select'
import UnlockableSelect from '@/components/unlockable-select'
import errorI18nKey from '@/utils/error-i18n-key'

export default {
  name: 'ProductItemForm',
  components: {
    RemoteSelect,
    UnlockableSelect
  },
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      sourceType: 'sku'
    }
  },
  computed: {
    isLoadingSelectableSkus () {
      return this.$store.state.productItem.isLoadingSelectableSkus
    },
    selectableSkus () {
      return this.$store.state.productItem.selectableSkus
    },
    isLoadingSelectableUnlockables () {
      return this.$store.state.productItem.isLoadingSelectableUnlockables
    },
    selectableUnlockables () {
      return this.$store.state.productItem.selectableUnlockables
    },
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('productItem', k, v[0]), { name: _.startCase(k) })
        return result
      }, {})
    },
    skuErrorMessage () {
      if (this.errorMessages['relationships']) {
        return 'SKU is invalid'
      }
    },
    unlockableErrorMessage () {
      if (this.errorMessages['relationships']) {
        return 'Unlockable is invalid'
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
    loadSelectableSkus: _.debounce(function (searchKeyword) {
      this.$store.dispatch('productItem/loadSelectableSkus', { search: searchKeyword })
    }, 300),
    resetSelectableSkus () {
      this.$store.dispatch('productItem/resetSelectableSkus')
    },
    loadSelectableUnlockables: _.debounce(function (searchKeyword) {
      this.$store.dispatch('productItem/loadSelectableUnlockables', { search: searchKeyword })
    }, 300),
    resetSelectableUnlockables () {
      this.$store.dispatch('productItem/resetSelectableUnlockables')
    },
    clearSource () {
      let formModel = _.cloneDeep(this.formModel)
      delete formModel.sku
      delete formModel.unlockable
      this.formModel = formModel
      this.updateValue()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.source-select {
  width: 100%;
}
</style>
