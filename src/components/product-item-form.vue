<template>
<el-form @input.native="updateValue" label-width="150px">

  <div class="block-title">
    <h3>Source</h3>
  </div>
  <div class="block">
    <div class="block-body">
      <el-form-item label="Type" required>
        <el-select @change="updateValue" v-model="formModel.sourceType">
          <el-option label="SKU" value="Sku"></el-option>
          <el-option label="Unlockable" value="Unlockable"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Name">
        <el-input></el-input>
      </el-form-item>

      <el-form-item v-if="formModel.product" label="ID" :error="errorMessages.product">
        {{formModel.product.id}}
      </el-form-item>
    </div>
  </div>

  <el-form-item label="Product">
    <el-autocomplete
      :fetch-suggestions="queryProduct"
      placeholder="Search for product..."
      @select="setProduct"
    ></el-autocomplete>
  </el-form-item>

  <el-form-item v-if="formModel.product" label="ID" :error="errorMessages.product">
    {{formModel.product.id}}
  </el-form-item>

  <hr>

  <el-form-item label="Code" :error="errorMessages.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMessages.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMessages.name" required>
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item label="Short Name" :error="errorMessages.name" required>
    <el-input v-model="formModel.shortName"></el-input>
  </el-form-item>

  <el-form-item label="Print Name" :error="errorMessages.printName" required>
    <el-input v-model="formModel.printName"></el-input>
  </el-form-item>

  <el-form-item label="Source Quantity" :error="errorMessages.sourceQuantity" required>
    <el-input-number v-model="formModel.sourceQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item label="Sort Index" :error="errorMessages.sortIndex" required>
    <el-input-number v-model="formModel.sortIndex" :min="0" :step="100"></el-input-number>
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
import JSONAPI from '@/jsonapi'
import ProductAPI from '@/api/product'

export default {
  name: 'ProductItemForm',
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
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
    queryProduct (searchKeyword, callback) {
      ProductAPI.queryRecord({ search: searchKeyword }).then(response => {
        let apiPayload = response.data
        let records = JSONAPI.deserialize(apiPayload.data)
        let names = _.map(records, (record) => {
          let info = ''
          if (record.code) {
            info += `[${record.code}]`
          }
          info += record.name + ' :: ' + record.status + ' :: ' + record.id
          return { value: info, id: 'x' }
        })

        callback(names)
      })
    },
    setProduct (item) {
      this.formModel.product = item
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
