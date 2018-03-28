<template>
<div class="component-wrapper product-fieldset">
  <div class="el-form-item el-form-item--small">
    <avatar-input v-model="formModel.avatar" @input="updateValue()"></avatar-input>
  </div>

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.id" label="Status" :error="errorMsgs.status" required>
    <el-select v-model="formModel.status" @change="updateValue()">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item :error="errorMsgs.kind" label="Kind" required>
    <el-select v-model="formModel.kind" :disabled="!canSelectKind" @change="handleKindChange($event)">
      <el-option label="Simple" value="simple"></el-option>
      <el-option label="With Variants" value="withVariants"></el-option>
      <el-option label="Combo" value="combo"></el-option>
      <el-option label="Variant" value="variant" :disabled="true"></el-option>
      <el-option label="Item" value="item" :disabled="true"></el-option>
    </el-select>
  </el-form-item>

  <template v-if="formModel.kind === 'simple' || formModel.kind === 'item' || formModel.kind === 'variant'">
    <el-form-item :error="errorMsgs.goods" label="Goods" required>
      <el-row>
        <el-col :span="8">
          <el-select v-model="goodsType" :disabled="!!formModel.id" @change="clearGoods()">
            <el-option label="Stockable" value="Stockable"></el-option>
            <el-option label="Unlockable" value="Unlockable"></el-option>
            <el-option label="Depositable" value="Depositable"></el-option>
          </el-select>
        </el-col>

        <el-col v-if="goodsType === 'Stockable'" :span="16">
        </el-col>

        <el-col v-if="goodsType === 'Unlockable'" :span="16">
          <unlockable-select v-model="formModel.goods" :disabled="!!formModel.id" @input="updateValue()" size="small" class="goods-select"></unlockable-select>
        </el-col>

        <el-col v-if="goodsType === 'Depositable'" :span="16">
          <depositable-select v-model="formModel.goods" :disabled="!!formModel.id" @input="updateValue()" size="small" class="goods-select"></depositable-select>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="Goods Quantity" :error="errorMsgs.goodsQuantity" required>
      <el-input-number v-model="formModel.goodsQuantity" @change="updateValue()" :min="1" :step="1"></el-input-number>
    </el-form-item>

    <el-form-item label="Name Sync" required>
      <el-radio-group v-model="formModel.nameSync" @change="updateValue()">
        <el-radio label="disabled">Disabled</el-radio>
        <el-radio label="syncWithGoods">Sync with Goods</el-radio>
      </el-radio-group>
    </el-form-item>

  </template>

  <el-form-item v-if="formModel.nameSync == 'disabled'" label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item v-if="formModel.kind === 'simple' || formModel.kind === 'combo' || formModel.kind === 'variant'" label="Maximum PO Quantity" :error="errorMsgs.maximumPublicOrderQuantity" required>
    <el-input-number v-model="formModel.maximumPublicOrderQuantity" :min="1" :step="1" @change="updateValue()"></el-input-number>
  </el-form-item>

  <el-form-item :error="errorMsgs.autoFulfill" label="Auto Fulfill" required>
    <el-switch
      v-model="formModel.autoFulfill"
      active-text="Yes"
      inactive-text="No"
      @change="updateValue()"
    >
    </el-switch>
  </el-form-item>

  <el-form-item v-if="formModel.kind === 'item' || formModel.kind === 'variant'" label="Sort Index" :error="errorMsgs.sortIndex" required>
    <el-input-number v-model="formModel.sortIndex" :min="0" :step="100" @change="updateValue()"></el-input-number>
  </el-form-item>

  <el-form-item v-if="formModel.itemMode == 'all'" label="Print Name" :error="errorMsgs.printName" required>
    <el-input v-model="formModel.printName" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Caption">
    <el-input v-model="formModel.caption" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Description">
    <el-input v-model="formModel.description" @input="updateValue()" type="textarea"></el-input>
  </el-form-item>
</div>
</template>

<script>
import AvatarInput from '@/components/avatar-input'
import UnlockableSelect from '@/components/unlockable-select'
import DepositableSelect from '@/components/depositable-select'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'product' })

export default {
  name: 'ProductFieldset',
  mixins: [FieldsetMixin],
  components: {
    AvatarInput,
    UnlockableSelect,
    DepositableSelect
  },
  data () {
    return {
      goodsType: 'Unlockable'
    }
  },
  computed: {
    canSelectKind () {
      if (this.formModel.id || this.formModel.kind === 'item' || this.formModel.kind === 'variant') {
        return false
      }

      return true
    }
  },
  methods: {
    handleKindChange (kind) {
      this.formModel.goods = null

      if (kind === 'combo') {
        this.formModel.nameSync = 'disabled'
      }
      this.updateValue()
    },

    handleGoodsChange (goods) {
      if (goods) {
        this.formModel.goods = goods
      } else {
        this.formMode.goods = null
      }

      this.updateValue()
    },
    clearGoods () {
      this.formModel.goods = null
      this.updateValue()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.goods-select {
  margin-left: 10px;
}
</style>
