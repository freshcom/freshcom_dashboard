<template>
<el-dialog :title="title" :show-close="false" :visible="isVisible" width="750px">
  <order-line-item-form v-model="recordDraft"></order-line-item-form>

  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel" plain size="small">Cancel</el-button>
    <el-button @click="save" type="primary" size="small">Save</el-button>
  </div>
</el-dialog>
</template>

<script>
import _ from 'lodash'
import { dollar } from '@/helpers/filters'
import PriceAmountInput from '@/components/price-amount-input'
import OrderLineItemForm from '@/components/order-line-item-form'

export default {
  name: 'OrderLineItemDialog',
  props: ['value', 'errors', 'isVisible', 'title'],
  components: {
    PriceAmountInput,
    OrderLineItemForm
  },
  filters: {
    dollar
  },
  data () {
    return {
      recordDraft: _.cloneDeep(this.value)
    }
  },
  watch: {
    value (v) {
      this.recordDraft = _.cloneDeep(v)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.recordDraft)
    }
  }
}
</script>
