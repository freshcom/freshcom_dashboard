<template>
<div class="component-wrapper stockable-fieldset">

  <el-row :gutter="10">

    <el-col :span="16">
      <div class="block">
        <div class="body">
          <el-form-item>
            <avatar-input v-model="formModel.avatar" @input="updateValue()"></avatar-input>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="SKU" :error="errorMsgs.number">
                <el-input v-model="formModel.number" @input="updateValue()"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Barcode" :error="errorMsgs.barcode">
                <el-input v-model="formModel.barcode" @input="updateValue()"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Name" :error="errorMsgs.name" required>
            <el-input v-model="formModel.name" @input="updateValue()" name="name"></el-input>
          </el-form-item>

          <el-form-item label="Print Name" :error="errorMsgs.printName">
            <el-input v-model="formModel.printName" @input="updateValue()"></el-input>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="Unit Of Measure" :error="errorMsgs.unitOfMeasure" required>
                <el-input v-model="formModel.unitOfMeasure" @input="updateValue()" name="unit-of-measure" width="200px"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="14">
              <el-form-item label="Label" :error="errorMsgs.label">
                <el-input v-model="formModel.label" @input="updateValue()" name="label"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Short Description">
            <el-input v-model="formModel.caption" @input="updateValue()"></el-input>
          </el-form-item>

          <el-form-item class="label-only" label="Specification"></el-form-item>
          <tui-editor mode="wysiwyg" v-model="formModel.specification" @input="updateValue()" height="200px"/>

          <el-form-item class="label-only" label="Long Description"></el-form-item>
          <tui-editor mode="wysiwyg" v-model="formModel.description" @input="updateValue()"/>
        </div>
      </div>
    </el-col>

    <el-col :span="8">
      <div class="block">
        <div class="body with-sub-header">
          <div class="sub-header">
            <h3>Status</h3>
          </div>

          <el-form-item :error="errorMsgs.status" required>
            <el-select v-model="formModel.status" @change="updateValue()">
              <el-option label="Active" value="active"></el-option>
              <el-option label="Draft" value="draft"></el-option>
              <el-option label="Disabled" value="disabled"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>

      <div class="block">
        <div class="body with-sub-header">
          <div class="sub-header">
            <h3>Weight</h3>
          </div>

          <div class="form-item-group">
            <el-form-item label="Variable Weight" :error="errorMsgs.variableWeight">
              <el-switch
                v-model="formModel.variableWeight"
                @change="updateValue()"
                active-text="Yes"
                inactive-text="No">
              </el-switch>
            </el-form-item>

            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="Weight" :error="errorMsgs.weight">
                  <el-input-number v-model="formModel.weight" :controls="false" @input="updateValue()"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Weight Unit" :error="errorMsgs.weightUnit">
                  <el-input v-model="formModel.weightUnit" @input="updateValue()" name="weight-unit" width="200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="body with-sub-header">
          <div class="sub-header">
            <h3>Storage</h3>
          </div>

          <div class="form-item-group">
            <el-form-item label="Storage Type" :error="errorMsgs.storageType">
              <el-select v-model="formModel.storageType" @change="updateValue()" placeholder="Select Storage Type">
                <el-option label="Room" value="room"></el-option>
                <el-option label="Frozen" value="frozen"></el-option>
                <el-option label="Refrigerated" value="refrigerated"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Storage Size" :error="errorMsgs.storageSize">
              <el-input-number v-model="formModel.storageSize" :controls="false" :step="100" @input="updateValue()"></el-input-number>
            </el-form-item>

            <el-form-item label="Storage Description">
              <el-input v-model="formModel.storageDescription" @input="updateValue()" type="textarea"></el-input>
            </el-form-item>

            <el-form-item label="Stackable" :error="errorMsgs.stackable">
              <el-switch
                v-model="formModel.stackable"
                @change="updateValue()"
                active-text="Yes"
                inactive-text="No">
              </el-switch>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="body with-sub-header">
          <div class="sub-header">
            <h3>Dimension</h3>
          </div>
          <div class="form-item-group">
            <el-row :gutter="5">
              <el-col :span="8">
                <el-form-item label="Length" :error="errorMsgs.length">
                  <el-input-number v-model="formModel.length" :controls="false" @input="updateValue()"></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="Width" :error="errorMsgs.width">
                  <el-input-number v-model="formModel.width" :controls="false" @input="updateValue()"></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="Height" :error="errorMsgs.height">
                  <el-input-number v-model="formModel.height" :controls="false" @input="updateValue()"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="Dimension Unit" :error="errorMsgs.dimensionUnit">
              <el-input v-model="formModel.dimensionUnit" @input="updateValue()" name="weight-unit" width="200px"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import tuiEditor from '@toast-ui/vue-editor/src/Editor.vue'

import AvatarInput from '@/components/avatar-input'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'stockable' })

export default {
  name: 'StockableFieldset',
  mixins: [FieldsetMixin],
  components: {
    AvatarInput,
    tuiEditor
  },
  data () {
    return {
      expandedSections: ['basic']
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
