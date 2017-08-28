<template>

<div class="delete-button">
  <el-popover
    ref="warnDelete"
    placement="left"
    width="160"
    v-model="isConfirmVisible">
    <p>Are you sure you?</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" @click="isConfirmVisible = false">Cancel</el-button>
      <el-button type="danger" size="mini" @click="confirmed">Delete</el-button>
    </div>
  </el-popover>
  <el-button :type="type" :size="size" v-popover:warnDelete>
    <slot>Delete</slot>
  </el-button>
</div>

</template>

<script>
export default {
  name: 'DeleteButton',
  props: {
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'danger'
    }
  },
  data () {
    return {
      isConfirmVisible: false
    }
  },
  methods: {
    confirmed () {
      this.isConfirmVisible = false
      this.$emit('confirmed')
    }
  }
}
</script>

<style scoped>
.delete-button {
  display: inline-block;
}
</style>
