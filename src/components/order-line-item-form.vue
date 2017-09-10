<template>
<el-form @input.native="updateValue">
  <el-form-item>
    <product-item-select v-model="productItemKeyword" class="search-input">
    </product-item-select>
    <span>@</span>
    <el-select @change="updateValue" v-model="price" class="price-input">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
    <span>x</span>
    <el-input-number v-model="quantity" :min="1" :step="1" class="quantity-input"></el-input-number>

    <span>BOX</span>

    <span>=</span>

    <el-button type="default" :disabled="true" class="add">
      Add
    </el-button>
  </el-form-item>

</el-form>
</template>

<script>
import _ from 'lodash'
import ProductItemSelect from '@/components/product-item-select'

export default {
  name: 'OrderLineItemForm',
  props: ['value', 'errors', 'record'],
  components: {
    ProductItemSelect
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      productItemKeyword: '',
      productItem: null,
      price: null,
      quantity: 1
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
    }, 300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-input {
  margin-bottom: 10px;
}

.price-input {
  width: 150px;
}

.quantity-input {
  width: 120px;
}

.add {
  float: right;
}
</style>
