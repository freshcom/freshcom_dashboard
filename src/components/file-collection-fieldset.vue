<template>
<div class="component-wrapper file-collection-fieldset">
  <el-form-item v-if="formModel.owner" :error="errorMsgs.owner" label="Owner">
    <div class="resource-block medium">
      <div class="resource">
        <p class="primary">
          <span>{{formModel.owner.type}}</span>
          <span v-if="formModel.owner.name">: {{formModel.owner.name}}</span>
        </p>
        <p class="secondary">{{formModel.owner.id}}</p>
      </div>
    </div>
  </el-form-item>

  <el-form-item :error="errorMsgs.name"  label="Name" required>
    <el-input v-model="formModel.name" @input="updateValue"></el-input>
  </el-form-item>

  <el-form-item :error="errorMsgs.label" label="Label">
    <el-input v-model="formModel.label" @input="updateValue"></el-input>
  </el-form-item>
</div>
</template>

<script>
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'unlockable' })

export default {
  name: 'FileCollectionFieldset',
  mixins: [FieldsetMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
