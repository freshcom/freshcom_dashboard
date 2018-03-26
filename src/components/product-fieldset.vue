<template>
<div class="component-wrapper product-fieldset">
  <avatar-input v-model="formModel.avatar" @input="updateValue()"></avatar-input>

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.id" label="Status" :error="errorMsgs.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item :error="errorMsgs.kind" label="Kind" required>
    <el-select v-model="formModel.kind" :disabled="!canSelectKind(formModel)" @change="updateValue">
      <el-option label="Simple" value="simple"></el-option>
      <el-option label="With Variants" value="withVariants"></el-option>
      <el-option label="Combo" value="combo"></el-option>
      <el-option label="Variant" value="variant" :disabled="true"></el-option>
      <el-option label="Item" value="item" :disabled="true"></el-option>
    </el-select>
  </el-form-item>

  <template v-if="formModel.kind === 'simple' || formModel.kind === 'item' || formModel.kind === 'variant'">
    <el-form-item :error="errorMsgs.source" label="Source" required>
      <el-row>
        <el-col :span="6">
          <el-select v-model="sourceType" @change="clearSource()">
            <el-option label="Stockable" value="Stockable"></el-option>
            <el-option label="Unlockable" value="Unlockable"></el-option>
            <el-option label="Depositable" value="Depositable"></el-option>
          </el-select>
        </el-col>

        <el-col v-if="sourceType === 'Stockable'" :span="18">
          <div class="source-select-wrapper">
            <remote-select
              :value="formModel.source"
              :search-method="searchStockable"
              @change="handleSourceChange"
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
              :value="formModel.source"
              :search-method="searchUnlockable"
              @change="handleSourceChange"
              no-data-text="No matching unlockable"
              placeholder="Type to search for unlockable..."
              class="source-select"
            >
            </remote-select>
          </div>
        </el-col>

        <el-col v-if="sourceType === 'Depositable'" :span="18">
          <div class="source-select-wrapper">
            <remote-select
              :value="formModel.source"
              :search-method="searchDepositable"
              @change="handleSourceChange"
              no-data-text="No matching depositable"
              placeholder="Type to search for depositable..."
              class="source-select"
            >
            </remote-select>
          </div>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="Source Quantity" :error="errorMsgs.sourceQuantity" required>
      <el-input-number @change="updateValue" v-model="formModel.sourceQuantity" :min="1" :step="1"></el-input-number>
    </el-form-item>

    <el-form-item label="Name Sync" required>
      <el-radio-group @change="updateValue" v-model="formModel.nameSync">
        <el-radio label="disabled">Disabled</el-radio>
        <el-radio label="syncWithGoods">Sync with Source</el-radio>
      </el-radio-group>
    </el-form-item>

  </template>

  <el-form-item v-if="formModel.nameSync == 'disabled'" label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.kind === 'simple' || formModel.kind === 'combo' || formModel.kind === 'variant'" label="Maximum PO Quantity" :error="errorMsgs.maximumPublicOrderQuantity" required>
    <el-input-number @change="updateValue" v-model="formModel.maximumPublicOrderQuantity" :min="1" :step="1"></el-input-number>
  </el-form-item>

  <el-form-item :error="errorMsgs.autoFulfill" label="Auto Fulfill" required>
    <el-switch
      v-model="formModel.autoFulfill"
      active-text="Yes"
      inactive-text="No"
      @change="updateValue"
    >
    </el-switch>
  </el-form-item>

  <el-form-item v-if="formModel.kind === 'item' || formModel.kind === 'variant'" label="Sort Index" :error="errorMsgs.sortIndex" required>
    <el-input-number @change="updateValue" v-model="formModel.sortIndex" :min="0" :step="100"></el-input-number>
  </el-form-item>

  <el-form-item v-if="formModel.itemMode == 'all'" label="Print Name" :error="errorMsgs.printName" required>
    <el-input v-model="formModel.printName"></el-input>
  </el-form-item>

  <el-form-item label="Caption">
    <el-input v-model="formModel.caption"></el-input>
  </el-form-item>

  <el-form-item label="Description">
    <el-input type="textarea" v-model="formModel.description"></el-input>
  </el-form-item>
</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import AvatarInput from '@/components/avatar-input'
import UnlockableSelect from '@/components/unlockable-select'


import Unlockable from '@/components/avatar-input'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'product' })

export default {
  name: 'ProductFieldset',
  mixins: [FieldsetMixin],
  components: {
    AvatarInput
  },
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      sourceType: 'Stockable',
      isUploadingAvatar: false
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
    errorMsgs () {
      return translateErrors(this.errors, 'product')
    },
    avatarUrl () {
      if (!this.formModel.avatar) {
        return
      }

      if (this.formModel.avatar.status === 'uploaded') {
        return this.formModel.avatar.url
      }

      return URL.createObjectURL(this.formModel.avatar.file)
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
    searchStockable (keyword) {
      return freshcom.listStockable({
        search: keyword
      }).then(response => {
        return response.data
      })
    },
    searchUnlockable (keyword) {
      return freshcom.listUnlockable({
        search: keyword
      }).then(response => {
        return response.data
      })
    },
    searchDepositable (keyword) {
      return freshcom.listDepositable({
        search: keyword
      }).then(response => {
        return response.data
      })
    },
    uploadAvatar (e) {
      let file = e.file
      let fFile = { type: 'File', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }

      freshcom.uploadFile(fFile, {}, {
        created: (response) => {
          this.formModel.avatar = _.merge({}, response.data, { percentage: 0, file: file })
          this.isUploadingAvatar = true
        },
        progress: _.throttle((percentage) => {
          this.formModel.avatar.percentage = percentage
        }, 300)
      }).then(response => {
        let fFile = response.data
        this.formModel.avatar = fFile
        this.updateValue()
        this.isUploadingAvatar = false
      }).catch(() => {
        this.isUploadingAvatar = false
      })
    },
    canSelectKind (formModel) {
      if (formModel.id || formModel.kind === 'item' || formModel.kind === 'variant') {
        return false
      }

      return true
    },
    handleSourceChange (source) {
      if (source) {
        this.formModel.goods = source
      } else {
        this.formMode.goods = null
      }

      this.$emit('input', this.formModel)
    },
    clearSource () {
      this.formModel.source = null
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
.source-select-wrapper {
  padding-left: 10px;
}
</style>
