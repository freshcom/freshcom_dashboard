<template>
  <div class="component-wrapper file-collection-membership-fieldset">
    <el-form-item label="File" :error="errorMsgs.file">
      <file-select v-model="formModel.file" @input="updateValue"></file-select>
    </el-form-item>

    <el-form-item label="Sort Index" :error="errorMsgs.sortIndex" required>
      <el-input-number v-model="formModel.sortIndex" :min="0" :step="1000" @change="updateValue"></el-input-number>
    </el-form-item>
  </div>
</template>

<script>
import FileSelect from '@/components/file-select'
import fieldsetMixinFactory from '@/mixins/fieldset'

let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'fileCollectionMembership' })

export default {
  name: 'FileCollectionMembershipFieldset',
  mixins: [FieldsetMixin],
  components: {
    FileSelect
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
