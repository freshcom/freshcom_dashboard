<template>
<div class="component-wrapper hover-button">
  <el-button ref="elButton" @click="handleClick" @mouseover.native="handleMouseover" @mouseleave.native="handleMouseleave" plain :type="bType" size="mini">
    <slot v-if="isHovering" name="hover"></slot>
    <slot v-else name="normal"></slot>
  </el-button>
</div>
</template>

<script>
export default {
  name: 'HoverButton',
  props: {
    type: String,
    hoverType: String,
    plain: Boolean
  },
  data () {
    return {
      isHovering: false,
      bType: this.type
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    },

    handleMouseover () {
      this.isHovering = true
      this.bType = this.hoverType
    },

    handleMouseleave () {
      this.isHovering = false
      this.bType = this.type
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.hover-button {
  display: inline-block;

  .el-button.el-button--mini {
    padding: 0 5px;
    line-height: 19px;
    font-size: 12px;
    font-weight: 400;
    border-radius: 4px;
    height: 20px;
    vertical-align: middle;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
  }
}
</style>
