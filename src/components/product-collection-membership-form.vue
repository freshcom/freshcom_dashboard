<template>
<el-form :model="formModel" @input.native="updateValue" label-width="150px" size="small" class="efc-form">
  <el-form-item label="Product" :error="errorMsgs.product" required>
    <remote-select
      :value="formModel.product"
      :search-method="searchProducts"
      @change="handleProductChange($event)"
      placeholder="Type to start searching..."
      class="product-select"
    >
    </remote-select>
  </el-form-item>

  <el-form-item label="Sort Index" :error="errorMsgs.sortIndex" required>
    <el-input-number @change="updateValue" v-model="formModel.sortIndex" :min="0" :step="100"></el-input-number>
  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import translateErrors from '@/helpers/translate-errors'
import RemoteSelect from '@/components/remote-select'

export default {
  name: 'ProductCollelctionCollectionForm',
  props: ['value', 'errors'],
  components: {
    RemoteSelect
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'productCollectionMembership')
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

    handleProductChange (product) {
      if (product) {
        this.formModel.product = product
      } else {
        this.formModel.product = null
      }

      this.$emit('input', this.formModel)
    },

    searchProducts (keyword) {
      return freshcom.listProduct({
        search: keyword
      }).then(response => {
        return response.data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.product-select {
  width: 100%;
}
</style>
