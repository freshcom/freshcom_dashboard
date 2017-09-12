<template>
<el-form @input.native="updateValue" label-width="180px">
  <el-form-item v-if="!record.product" label="Product" required>
    <product-select @select="setProduct"></product-select>
  </el-form-item>

  <el-form-item v-if="record.product" label="Product">
    {{formModel.product.id}}
  </el-form-item>

  <el-form-item v-if="!record.id" label="Source Type" required>
    <el-select v-model="sourceType">
      <el-option label="SKU" value="Sku"></el-option>
      <el-option label="Unlockable" value="Unlockable"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item v-if="sourceType == 'Sku' && !record.id" label="SKU" :error="skuErrorMessage" required>
    <sku-select @select="setSku"></sku-select>
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
import ProductSelect from '@/components/product-select'
import SkuSelect from '@/components/sku-select'
import errorI18nKey from '@/utils/error-i18n-key'

export default {
  name: 'ProductItemForm',
  components: {
    ProductSelect,
    SkuSelect
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
        result[k] = this.$t(errorI18nKey('ProductItem', k, v[0]), { name: _.startCase(k) })
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
    setSku (sku) {
      if (sku) {
        this.formModel.sku = { id: sku.id, type: 'Sku' }
      } else {
        this.formModel.sku = {}
      }
      this.updateValue()
    },
    setProduct (product) {
      if (product) {
        this.formModel.product = { id: product.id, type: 'Product' }
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

</style>
