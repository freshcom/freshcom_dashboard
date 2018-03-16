<template>
  <el-button :type="type" :size="size" :class="iconOnly ? 'icon' : ''" plain v-popover:warnDelete>
    <el-popover
      ref="warnDelete"
      placement="left"
      width="160"
      v-model="isConfirmVisible">
      <p>Are you sure?</p>
      <div style="text-align: right; margin: 0">
        <el-button @click="isConfirmVisible = false" plain size="mini">Cancel</el-button>
        <el-button type="danger" size="mini" @click="confirmed">{{confirmButtonText}}</el-button>
      </div>
    </el-popover>

    <slot>Delete</slot>
  </el-button>
</template>

<script>
export default {
  name: 'ConfirmButton',
  props: {
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
    confirmButtonText: {
      type: String,
      default: 'Delete'
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
.confirm-button {
  display: inline-block;
}
</style>
