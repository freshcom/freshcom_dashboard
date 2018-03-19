<template>
<div class="component-wrapper unlock-fieldset">
  <el-form-item label="Unlockable" :error="errorMsgs.unlockable" required>
    <unlockable-select v-model="formModel.unlockable" :disabled="!!formModel.id" @input="updateValue"></unlockable-select>
  </el-form-item>

  <el-form-item label="Sort Index" :error="errorMsgs.sortIndex" required>
    <el-input-number @change="updateValue" v-model="formModel.sortIndex" :min="0" :step="1000"></el-input-number>
  </el-form-item>
</div>
</template>

<script>
import UnlockableSelect from '@/components/unlockable-select'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'fileCollectionMembership' })

export default {
  name: 'UnlockFieldset',
  mixins: [FieldsetMixin],
  components: {
    UnlockableSelect
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
