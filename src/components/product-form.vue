<template>
<el-form :model="formModel" @input.native="updateValue" size="small" label-width="170px">
  <div class="file-uploader">
    <el-upload :http-request="uploadAvatar" action="" :show-file-list="false">
      <img v-if="avatarUrl" :src="avatarUrl" class="file">
      <i v-else class="el-icon-plus file-uploader-icon"></i>
    </el-upload>
    <el-progress v-if="pendingAvatar" :show-text="false" :percentage="pendingAvatar.percentage"></el-progress>
  </div>

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

  <el-form-item :error="errorMessages.kind" label="Kind" required>
    <el-select v-model="formModel.kind" :disabled="!canSelectKind(formModel)" @change="updateValue">
      <el-option label="Simple" value="simple"></el-option>
      <el-option label="With Variants" value="withVariants"></el-option>
      <el-option label="Combo" value="combo"></el-option>
      <el-option label="Variant" value="variant" :disabled="true"></el-option>
      <el-option label="Item" value="item" :disabled="true"></el-option>
    </el-select>
  </el-form-item>

  <template v-if="formModel.kind === 'simple' || formModel.kind === 'item' || formModel.kind === 'variant'">
    <el-form-item :error="errorMessages.source" label="Source" required>
      <el-row>
        <el-col :span="6">
          <el-select v-model="sourceType" @change="clearSource()">
            <el-option label="Stockable" value="Stockable"></el-option>
            <el-option label="Unlockable" value="Unlockable"></el-option>
          </el-select>
        </el-col>
        <el-col v-if="sourceType === 'Stockable'" :span="18">
          <div class="source-select-wrapper">
            <remote-select
              v-model="formModel.source"
              :records="selectableStockables"
              :is-loading="isLoadingSelectableStockables"
              @filter="loadSelectableStockables"
              @reset="resetSelectableStockables"
              @input="updateValue"
              no-data-text="No matching Stockable"
              placeholder="Type to search for Stockable..."
              class="source-select"
            >
            </remote-select>
          </div>
        </el-col>

        <el-col v-if="sourceType === 'Unlockable'" :span="18">
          <div class="source-select-wrapper">
            <remote-select
              v-model="formModel.source"
              :records="selectableUnlockables"
              :isLoading="isLoadingSelectableUnlockables"
              @filter="loadSelectableUnlockables"
              @reset="resetSelectableUnlockables"
              @input="updateValue"
              no-data-text="No matching Unlockable"
              placeholder="Type to search for Unlockable..."
              class="source-select"
            >
            </remote-select>
          </div>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="Source Quantity" :error="errorMessages.sourceQuantity" required>
      <el-input-number @change="updateValue" v-model="formModel.sourceQuantity" :min="1" :step="1"></el-input-number>
    </el-form-item>

    <el-form-item label="Name Sync" required>
      <el-radio-group @change="updateValue" v-model="formModel.nameSync">
        <el-radio label="disabled">Disabled</el-radio>
        <el-radio label="syncWithSource">Sync with Source</el-radio>
      </el-radio-group>
    </el-form-item>

  </template>

  <el-form-item v-if="formModel.nameSync == 'disabled'" label="Name" :error="errorMessages.name" required>
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.kind === 'simple' || formModel.kind === 'combo' || formModel.kind === 'variant'" label="Maximum PO Quantity" :error="errorMessages.maximumPublicOrderQuantity" required>
    <el-input-number @change="updateValue" v-model="formModel.maximumPublicOrderQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item v-if="formModel.kind === 'item' || formModel.kind === 'variant'" label="Sort Index" :error="errorMessages.sortIndex" required>
    <el-input-number @change="updateValue" v-model="formModel.sortIndex" :min="0" :step="100"></el-input-number>
  </el-form-item>

  <el-form-item v-if="formModel.itemMode == 'all'" label="Print Name" :error="errorMessages.printName" required>
    <el-input v-model="formModel.printName"></el-input>
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
import errorI18nKey from '@/utils/error-i18n-key'

export default {
  name: 'ProductForm',
  components: {
    RemoteSelect
  },
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      sourceType: 'Stockable',
      imageUrl: '',
      pendingAvatarId: ''
    }
  },
  computed: {
    isLoadingSelectableStockables () {
      return this.$store.state.product.isLoadingSelectableStockables
    },
    selectableStockables () {
      return this.$store.state.product.selectableStockables
    },
    isLoadingSelectableUnlockables () {
      return this.$store.state.product.isLoadingSelectableUnlockables
    },
    selectableUnlockables () {
      return this.$store.state.product.selectableUnlockables
    },
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('Product', k, v[0]), { name: _.startCase(k) })
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
    loadSelectableStockables: _.debounce(function (searchKeyword) {
      this.$store.dispatch('product/loadSelectableStockables', { search: searchKeyword })
    }, 300),
    resetSelectableStockables () {
      this.$store.dispatch('product/resetSelectableStockables')
    },
    loadSelectableUnlockables: _.debounce(function (searchKeyword) {
      this.$store.dispatch('product/loadSelectableUnlockables', { search: searchKeyword })
    }, 300),
    resetSelectableUnlockables () {
      this.$store.dispatch('product/resetSelectableUnlockables')
    },
    uploadAvatar (e) {
      let file = e.file
      let externalFile = { type: 'ExternalFile', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }
      this.$store.dispatch('externalFile/pushPendingRecords', [externalFile]).then(externalFiles => {
        this.pendingAvatarId = externalFiles[0].id
      })
    },
    clearSource () {
      let formModel = _.cloneDeep(this.formModel)
      formModel.source = {}
      this.formModel = formModel
      this.updateValue()
    },
    canSelectKind (formModel) {
      if (formModel.id || formModel.kind === 'item' || formModel.kind === 'variant') {
        return false
      }

      return true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.source-select {
  width: 100%;
}
.source-select-wrapper {
  padding-left: 10px;
}
</style>
